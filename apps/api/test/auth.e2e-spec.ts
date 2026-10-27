import { randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { eq } from "drizzle-orm";
import request from "supertest";
import type { App } from "supertest/types.js";
import { AppModule } from "../src/app.module.js";
import { setupApp } from "../src/app.setup.js";
import { DATABASE, type Database } from "../src/database/database.module.js";
import { users } from "../src/database/schema/index.js";

// Testes de ponta a ponta do login (decisão AU9-A): sobem a API inteira,
// ligada a um banco de verdade, e fazem os pedidos como o navegador faria.
describe("Login (e2e)", () => {
  let app: INestApplication<App>;
  let origin: string;
  // Um e-mail novo a cada execução, sempre fictício.
  const email = `teste-${randomUUID()}@example.com`;
  const password = "senha-de-teste";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Igual ao main.ts: o Better Auth lê o corpo dos pedidos do jeito dele.
    app = moduleRef.createNestApplication({ bodyParser: false });
    setupApp(app);
    await app.init();

    // O navegador sempre manda a origem do site nos pedidos de login.
    origin = app.get(ConfigService).getOrThrow<string>("BETTER_AUTH_URL");
  });

  afterAll(async () => {
    // Apaga o usuário de teste (e, pela cascata, a sessão e a conta dele).
    const db = app.get<Database>(DATABASE);
    await db.delete(users).where(eq(users.email, email));
    await app.close();
  });

  it("a rota de saúde é pública", async () => {
    await request(app.getHttpServer()).get("/api/health").expect(200);
  });

  it("uma rota protegida responde 401 sem login", async () => {
    await request(app.getHttpServer()).get("/api/me").expect(401);
  });

  it("recusa senha com menos de 8 caracteres", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/sign-up/email")
      .set("Origin", origin)
      .send({ name: "Teste", email, password: "1234567" })
      .expect(400);
  });

  it("cadastra, entra, sai e entra de novo", async () => {
    // O "agent" guarda o cookie de login entre um pedido e outro, como o navegador.
    const browser = request.agent(app.getHttpServer());

    // Cadastro: já entra direto (decisão AU4-A).
    await browser
      .post("/api/auth/sign-up/email")
      .set("Origin", origin)
      .send({ name: "Teste", email, password })
      .expect(200);

    const me = await browser.get("/api/me").expect(200);
    expect(me.body).toMatchObject({ name: "Teste", email, role: "user" });

    // Logout: a rota protegida volta a responder 401.
    await browser
      .post("/api/auth/sign-out")
      .set("Origin", origin)
      .send({})
      .expect(200);
    await browser.get("/api/me").expect(401);

    // Senha errada não entra.
    await browser
      .post("/api/auth/sign-in/email")
      .set("Origin", origin)
      .send({ email, password: "senha-errada" })
      .expect(401);

    // Senha certa entra de novo.
    await browser
      .post("/api/auth/sign-in/email")
      .set("Origin", origin)
      .send({ email, password })
      .expect(200);
    await browser.get("/api/me").expect(200);
  });

  it("recusa login vindo de outro site", async () => {
    await request(app.getHttpServer())
      .post("/api/auth/sign-in/email")
      .set("Origin", "https://site-malicioso.example.com")
      .send({ email, password })
      .expect(403);
  });
});
