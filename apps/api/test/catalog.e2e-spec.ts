import { randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import type { CategoryItem, CompanyCard } from "@portalivp/shared";
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
  neighborhoods,
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
  });

  afterAll(async () => {
    // Apagar o dono apaga as lojas dele (cascata); depois, a categoria e o bairro.
    await db.delete(users).where(eq(users.id, ownerId));
    await db.delete(categories).where(eq(categories.id, categoryId));
    await db.delete(neighborhoods).where(eq(neighborhoods.id, neighborhoodId));
    await app.close();
  });

  it("lista as categorias sem exigir login", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/categories")
      .expect(200);
    const names = (response.body as CategoryItem[]).map((c) => c.name);
    expect(names).toContain(`Categoria de teste ${suffix}`);
  });

  it("mostra só as lojas ativas, filtrando pela categoria", async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/companies?category=${categoryId}`)
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

  it("recusa uma categoria que não é um id válido", async () => {
    await request(app.getHttpServer())
      .get("/api/companies?category=abc")
      .expect(400);
  });
});
