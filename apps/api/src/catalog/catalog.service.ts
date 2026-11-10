import { Inject, Injectable } from "@nestjs/common";
import {
  isOpenNow,
  toSlug,
  type CategoryItem,
  type CompanyCard,
  type CompanyDetails,
  type ProductItem,
} from "@portalivp/shared";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { DATABASE, type Database } from "../database/database.module.js";
import {
  categories,
  companies,
  companyCategories,
  companyImages,
  companyPaymentMethods,
  companyServiceTypes,
  contactChannels,
  neighborhoods,
  openingHours,
  productCategories,
  productImages,
  products,
  socialLinks,
} from "../database/schema/index.js";

// Quantas lojas a página inicial mostra (decisão HP1-A).
const HOME_COMPANIES_LIMIT = 8;

// Consultas públicas do catálogo: categorias e lojas ativas.
@Injectable()
export class CatalogService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  // Todas as categorias, em ordem alfabética, com o slug calculado a partir
  // do nome (decisão HP11-B).
  async listCategories(): Promise<CategoryItem[]> {
    const rows = await this.db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .orderBy(asc(categories.name));
    return rows.map((row) => ({ ...row, slug: toSlug(row.name) }));
  }

  // As lojas ATIVAS mais recentes (só elas aparecem ao público, M3-B),
  // opcionalmente só as de uma categoria, informada pelo slug (ex.: "pet-shop").
  async listCompanies(categorySlug?: string): Promise<CompanyCard[]> {
    // 0. Com filtro: descobre qual categoria tem esse slug. Se nenhuma tiver,
    // não há lojas para mostrar.
    let categoryId: string | undefined;
    if (categorySlug) {
      const allCategories = await this.listCategories();
      categoryId = allCategories.find((c) => c.slug === categorySlug)?.id;
      if (!categoryId) {
        return [];
      }
    }

    // 1. As lojas, com o nome do bairro.
    const rows = await this.db
      .select({
        id: companies.id,
        name: companies.name,
        description: companies.description,
        neighborhood: neighborhoods.name,
      })
      .from(companies)
      .innerJoin(neighborhoods, eq(companies.neighborhoodId, neighborhoods.id))
      .where(
        and(
          eq(companies.status, "active"),
          // Com filtro: só as lojas ligadas àquela categoria.
          categoryId
            ? inArray(
                companies.id,
                this.db
                  .select({ id: companyCategories.companyId })
                  .from(companyCategories)
                  .where(eq(companyCategories.categoryId, categoryId)),
              )
            : undefined,
        ),
      )
      // Mais recentes primeiro; empate (mesma data) em ordem alfabética,
      // para a ordem não mudar de uma consulta para outra.
      .orderBy(desc(companies.createdAt), asc(companies.name))
      .limit(HOME_COMPANIES_LIMIT);

    if (rows.length === 0) {
      return [];
    }
    const ids = rows.map((row) => row.id);

    // 2. As categorias dessas lojas.
    const categoryRows = await this.db
      .select({ companyId: companyCategories.companyId, name: categories.name })
      .from(companyCategories)
      .innerJoin(categories, eq(companyCategories.categoryId, categories.id))
      .where(inArray(companyCategories.companyId, ids))
      .orderBy(asc(categories.name));

    // 3. As fotos dessas lojas, da primeira para a última (a primeira é a capa, P10).
    const imageRows = await this.db
      .select({
        companyId: companyImages.companyId,
        fileName: companyImages.fileName,
      })
      .from(companyImages)
      .where(inArray(companyImages.companyId, ids))
      .orderBy(asc(companyImages.position));

    // Junta tudo no formato do cartão.
    return rows.map((row) => ({
      ...row,
      categories: categoryRows
        .filter((category) => category.companyId === row.id)
        .map((category) => category.name),
      coverImage:
        imageRows.find((image) => image.companyId === row.id)?.fileName ?? null,
    }));
  }

  // Tudo o que a página da loja mostra (decisão PG2). Devolve null se a loja
  // não existe ou não está ativa: para o visitante, as duas dão "Loja não
  // encontrada" (só "active" aparece ao público, M3-B).
  async getCompany(
    id: string,
    now = new Date(),
  ): Promise<CompanyDetails | null> {
    // 1. A loja, com o nome do bairro.
    const [company] = await this.db
      .select({
        id: companies.id,
        name: companies.name,
        description: companies.description,
        logoFileName: companies.logoFileName,
        neighborhood: neighborhoods.name,
        street: companies.street,
        number: companies.number,
        complement: companies.complement,
        cep: companies.cep,
        latitude: companies.latitude,
        longitude: companies.longitude,
      })
      .from(companies)
      .innerJoin(neighborhoods, eq(companies.neighborhoodId, neighborhoods.id))
      .where(and(eq(companies.id, id), eq(companies.status, "active")));

    if (!company) {
      return null;
    }

    // 2. As listas ligadas à loja. São consultas independentes, então rodam
    // ao mesmo tempo (Promise.all).
    const [
      imageRows,
      categoryRows,
      hourRows,
      serviceTypeRows,
      paymentRows,
      contactRows,
      socialRows,
      productRows,
    ] = await Promise.all([
      this.db
        .select({ fileName: companyImages.fileName })
        .from(companyImages)
        .where(eq(companyImages.companyId, id))
        .orderBy(asc(companyImages.position)),
      this.db
        .select({ id: categories.id, name: categories.name })
        .from(companyCategories)
        .innerJoin(categories, eq(companyCategories.categoryId, categories.id))
        .where(eq(companyCategories.companyId, id))
        .orderBy(asc(categories.name)),
      this.db
        .select({
          weekday: openingHours.weekday,
          opensAt: openingHours.opensAt,
          closesAt: openingHours.closesAt,
        })
        .from(openingHours)
        .where(eq(openingHours.companyId, id))
        .orderBy(asc(openingHours.weekday), asc(openingHours.opensAt)),
      this.db
        .select({ type: companyServiceTypes.type })
        .from(companyServiceTypes)
        .where(eq(companyServiceTypes.companyId, id))
        .orderBy(asc(companyServiceTypes.type)),
      this.db
        .select({ method: companyPaymentMethods.method })
        .from(companyPaymentMethods)
        .where(eq(companyPaymentMethods.companyId, id))
        .orderBy(asc(companyPaymentMethods.method)),
      this.db
        .select({ type: contactChannels.type, value: contactChannels.value })
        .from(contactChannels)
        .where(eq(contactChannels.companyId, id))
        .orderBy(asc(contactChannels.type), asc(contactChannels.value)),
      this.db
        .select({ platform: socialLinks.platform, url: socialLinks.url })
        .from(socialLinks)
        .where(eq(socialLinks.companyId, id))
        .orderBy(asc(socialLinks.platform)),
      // Só os produtos ativos, em ordem alfabética (PG7-A).
      this.db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          category: productCategories.name,
        })
        .from(products)
        .innerJoin(
          productCategories,
          eq(products.categoryId, productCategories.id),
        )
        .where(and(eq(products.companyId, id), eq(products.active, true)))
        .orderBy(asc(products.name)),
    ]);

    // 3. A primeira foto de cada produto (a primeira é a capa, P10).
    const productIds = productRows.map((product) => product.id);
    const productImageRows =
      productIds.length === 0
        ? []
        : await this.db
            .select({
              productId: productImages.productId,
              fileName: productImages.fileName,
            })
            .from(productImages)
            .where(inArray(productImages.productId, productIds))
            .orderBy(asc(productImages.position));

    const productList: ProductItem[] = productRows.map((product) => ({
      ...product,
      image:
        productImageRows.find((image) => image.productId === product.id)
          ?.fileName ?? null,
    }));

    // O banco devolve a hora como "08:00:00"; a página só usa "08:00".
    const hours = hourRows.map((row) => ({
      weekday: row.weekday,
      opensAt: row.opensAt.slice(0, 5),
      closesAt: row.closesAt.slice(0, 5),
    }));

    // Junta tudo no formato da página.
    return {
      id: company.id,
      name: company.name,
      description: company.description,
      logoImage: company.logoFileName,
      images: imageRows.map((image) => image.fileName),
      categories: categoryRows.map((category) => ({
        ...category,
        slug: toSlug(category.name),
      })),
      neighborhood: company.neighborhood,
      address: {
        street: company.street,
        number: company.number,
        complement: company.complement,
        cep: company.cep,
      },
      // Latitude e longitude vêm juntas ou as duas vazias (regra do banco).
      location:
        company.latitude !== null && company.longitude !== null
          ? { latitude: company.latitude, longitude: company.longitude }
          : null,
      openingHours: hours,
      isOpenNow: isOpenNow(hours, now),
      serviceTypes: serviceTypeRows.map((row) => row.type),
      paymentMethods: paymentRows.map((row) => row.method),
      contacts: contactRows,
      socialLinks: socialRows,
      products: productList,
    };
  }
}
