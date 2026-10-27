import {
  Global,
  Inject,
  Logger,
  Module,
  type OnApplicationShutdown,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { Env } from "../config/env.js";
import * as schema from "./schema/index.js";

// Nome usado para pedir a conexão com o banco em qualquer parte da API:
// constructor(@Inject(DATABASE) private readonly db: Database) {}
export const DATABASE = Symbol("DATABASE");

// O Drizzle por cima, e o Pool do pg (o conjunto de conexões) em $client.
export type Database = NodePgDatabase<typeof schema> & { $client: Pool };

const logger = new Logger("Database");

function createDatabase(config: ConfigService<Env, true>): Database {
  const pool = new Pool({
    connectionString: config.get("DATABASE_URL", { infer: true }),
  });

  // Se o banco cair, uma conexão parada no Pool avisa com um erro. Sem este
  // "ouvinte", o Node derruba a API inteira; com ele, o erro só vai para o log
  // e o Pool abre conexões novas quando o banco voltar.
  pool.on("error", (error) => {
    logger.error(`Conexão com o banco perdida: ${error.message}`);
  });

  // Passar o schema permite consultas como db.query.companies.findMany().
  return drizzle({ client: pool, schema });
}

// @Global: a conexão fica disponível para todos os módulos, sem importar este em cada um.
@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      inject: [ConfigService],
      useFactory: createDatabase,
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  // Fecha as conexões com o banco quando a API desliga.
  async onApplicationShutdown(): Promise<void> {
    await this.db.$client.end();
  }
}
