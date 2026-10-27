import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { AppModule } from "./app.module.js";
import { setupApp } from "./app.setup.js";
import type { Env } from "./config/env.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // O Better Auth precisa ler o corpo dos pedidos de login do jeito dele.
    // A biblioteca de integração (AU1-A) liga de novo o leitor de JSON para as outras rotas.
    bodyParser: false,
  });
  setupApp(app);

  const config = app.get<ConfigService<Env, true>>(ConfigService);
  await app.listen(config.get("PORT", { infer: true }));
}
await bootstrap();
