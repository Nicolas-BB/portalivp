import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { envSchema } from "./config/env.js";
import { DatabaseModule } from "./database/database.module.js";
import { HealthModule } from "./health/health.module.js";

@Module({
  imports: [
    // Lê o .env da raiz do repositório (decisão K6-A) e valida com o Zod.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "../../.env",
      validate: (config) => envSchema.parse(config),
    }),
    DatabaseModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
