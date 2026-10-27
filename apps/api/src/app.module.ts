import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { createAuth } from "./auth/auth.js";
import { CatalogModule } from "./catalog/catalog.module.js";
import { envSchema, type Env } from "./config/env.js";
import {
  DATABASE,
  DatabaseModule,
  type Database,
} from "./database/database.module.js";
import { HealthModule } from "./health/health.module.js";
import { MeModule } from "./me/me.module.js";

@Module({
  imports: [
    // Lê o .env da raiz do repositório (decisão K6-A) e valida com o Zod.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env",
      validate: (config) => envSchema.parse(config),
    }),
    DatabaseModule,
    // Login com o Better Auth (decisão AU1-A). Usa a mesma conexão com o banco
    // e as mesmas variáveis validadas da API. Protege TODAS as rotas por padrão:
    // uma rota pública precisa de @AllowAnonymous().
    AuthModule.forRootAsync({
      inject: [DATABASE, ConfigService],
      useFactory: (db: Database, config: ConfigService<Env, true>) => ({
        auth: createAuth(db, {
          baseURL: config.get("BETTER_AUTH_URL", { infer: true }),
          secret: config.get("BETTER_AUTH_SECRET", { infer: true }),
        }),
      }),
    }),
    HealthModule,
    MeModule,
    CatalogModule,
  ],
})
export class AppModule {}
