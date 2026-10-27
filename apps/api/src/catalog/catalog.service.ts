import { Inject, Injectable } from "@nestjs/common";
import { toSlug, type CategoryItem, type CompanyCard } from "@portalivp/shared";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { DATABASE, type Database } from "../database/database.module.js";
import {
  categories,
  companies,
  companyCategories,
  companyImages,
  neighborhoods,
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
}
