import { randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type {
  CategoryItem,
  CompanyCard,
  CompanyDetails,
} from "@portalivp/shared";
import { eq } from "drizzle-orm";
import request from "supertest";
import type { App } from "supertest/types.js";
import { AppModule } from "../src/app.module.js";
import { setupApp } from "../src/app.setup.js";
import { DATABASE, type Database } from "../src/database/database.module.js";
import {
  categories,
  companies,
  companyCategories,
  companyPaymentMethods,
  contactChannels,
  neighborhoods,
  openingHours,
  productCategories,
  products,
  users,
} from "../src/database/schema/index.js";

// Testes de ponta a ponta das rotas públicas do catálogo (decisão HP10).
// Criam os próprios dados, com nomes únicos, e apagam tudo no fim.
describe("Catálogo (e2e)", () => {
  let app: INestApplication<App>;
  let db: Database;
  const suffix = randomUUID();
  let categoryId: string;
  let neighborhoodId: string;
  let ownerId: string;
  let productCategoryId: string;
  let activeCompanyId: string;
  let pendingCompanyId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication({ bodyParser: false });
    setupApp(app);
    await app.init();
    db = app.get<Database>(DATABASE);

    // Uma categoria, um bairro e um dono só deste teste.
    [{ id: categoryId }] = await db
      .insert(categories)
      .values({ name: `Categoria de teste ${suffix}` })
      .returning();
    [{ id: neighborhoodId }] = await db
      .insert(neighborhoods)
      .values({ name: `Bairro de teste ${suffix}` })
      .returning();
    [{ id: ownerId }] = await db
      .insert(users)
      .values({ name: "Dono Teste", email: `dono-${suffix}@example.com` })
      .returning();

    // Duas lojas na categoria de teste: uma ativa e uma pendente.
    const newCompanies = await db
      .insert(companies)
      .values(
        ["active", "pending"].map((status) => ({
          ownerId,
          name: `Loja ${status} ${suffix}`,
          description: "Loja de teste",
          status: status as "active" | "pending",
          cep: "86870-000",
          street: "Rua Exemplo",
          number: "1",
          neighborhoodId,
        })),
      )
      .returning();
    await db
      .insert(companyCategories)
      .values(
        newCompanies.map((company) => ({ companyId: company.id, categoryId })),
      );
    [activeCompanyId, pendingCompanyId] = newCompanies.map((c) => c.id);

    // Dados da página da loja ativa: horário, pagamento, contato e produtos
    // (um ativo e um inativo, que não pode aparecer).
    [{ id: productCategoryId }] = await db
      .insert(productCategories)
      .values({ name: `Categoria de produto ${suffix}` })
      .returning();
    await db.insert(openingHours).values({
      companyId: activeCompanyId,
      weekday: 1,
      opensAt: "08:00",
      closesAt: "12:00",
    });
    await db
      .insert(companyPaymentMethods)
      .values({ companyId: activeCompanyId, method: "pix" });
    await db.insert(contactChannels).values({
      companyId: activeCompanyId,
      type: "whatsapp",
      value: "(43) 90000-0000",
    });
    await db.insert(products).values(
      [true, false].map((active) => ({
        companyId: activeCompanyId,
        categoryId: productCategoryId,
        name: active ? "Produto ativo" : "Produto inativo",
        price: active ? 10.5 : null,
        active,
      })),
    );
  });

  afterAll(async () => {
    // Apagar o dono apaga as lojas dele (cascata), e com elas os produtos;
    // depois, as categorias e o bairro.
    await db.delete(users).where(eq(users.id, ownerId));
    await db
      .delete(productCategories)
      .where(eq(productCategories.id, productCategoryId));
    await db.delete(categories).where(eq(categories.id, categoryId));
    await db.delete(neighborhoods).where(eq(neighborhoods.id, neighborhoodId));
    await app.close();
  });

  it("lista as categorias com o slug, sem exigir login", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/categories")
      .expect(200);
    expect(response.body as CategoryItem[]).toContainEqual({
      id: categoryId,
      name: `Categoria de teste ${suffix}`,
      slug: `categoria-de-teste-${suffix}`,
    });
  });

  it("mostra só as lojas ativas, filtrando pelo slug da categoria", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/companies?category=categoria-de-teste-${suffix}`)
      .expect(200);
    const cards = response.body as CompanyCard[];

    expect(cards.map((card) => card.name)).toEqual([`Loja active ${suffix}`]);
    expect(cards[0]).toMatchObject({
      neighborhood: `Bairro de teste ${suffix}`,
      categories: [`Categoria de teste ${suffix}`],
      coverImage: null,
    });
  });

  it("lista lojas sem filtro e sem exigir login", async () => {
    await request(app.getHttpServer()).get("/api/companies").expect(200);
  });

  it("devolve a lista vazia para um slug que não existe", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/companies?category=categoria-que-nao-existe")
      .expect(200);
    expect(response.body).toEqual([]);
  });

  it("recusa uma categoria fora do formato de slug", async () => {
    await request(app.getHttpServer())
      .get("/api/companies?category=Pet%20Shop")
      .expect(400);
  });

  it("mostra a página de uma loja ativa, sem exigir login", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/companies/${activeCompanyId}`)
      .expect(200);
    const company = response.body as CompanyDetails;

    expect(company).toMatchObject({
      id: activeCompanyId,
      name: `Loja active ${suffix}`,
      logoImage: null,
      images: [],
      neighborhood: `Bairro de teste ${suffix}`,
      address: {
        street: "Rua Exemplo",
        number: "1",
        complement: null,
        cep: "86870-000",
      },
      location: null,
      openingHours: [{ weekday: 1, opensAt: "08:00", closesAt: "12:00" }],
      paymentMethods: ["pix"],
      contacts: [{ type: "whatsapp", value: "(43) 90000-0000" }],
      socialLinks: [],
      serviceTypes: [],
    });
    expect(typeof company.isOpenNow).toBe("boolean");
    expect(company.categories).toEqual([
      {
        id: categoryId,
        name: `Categoria de teste ${suffix}`,
        slug: `categoria-de-teste-${suffix}`,
      },
    ]);
    // O produto inativo não aparece.
    expect(company.products).toEqual([
      {
        id: expect.any(String) as string,
        name: "Produto ativo",
        description: null,
        price: 10.5,
        category: `Categoria de produto ${suffix}`,
        image: null,
      },
    ]);
  });

  it("não mostra uma loja pendente", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/companies/${pendingCompanyId}`)
      .expect(404);
    expect((response.body as { message: string }).message).toBe(
      "Loja não encontrada.",
    );
  });

  it("responde 404 para um id que não existe ou fora do formato", async () => {
    await request(app.getHttpServer())
      .get(`/api/companies/${randomUUID()}`)
      .expect(404);
    await request(app.getHttpServer())
      .get("/api/companies/nao-e-um-id")
      .expect(404);
  });
});
