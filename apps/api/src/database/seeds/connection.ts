import { existsSync } from "node:fs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { envSchema } from "../../config/env.js";
import type { Database } from "../database.module.js";
import * as schema from "../schema/index.js";

// Conexão usada pelos scripts iniciais, que rodam fora da API.
// Usa a role do app (DATABASE_URL): os scripts só inserem dados, não criam tabelas.
export function connectForSeed(): Database {
  // No computador de quem desenvolve, as variáveis vêm do .env da raiz.
  // Na VPS, elas já chegam pelo Docker, sem arquivo.
  const envFile = "../../.env";
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }

  const env = envSchema.parse(process.env);
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  return drizzle({ client: pool, schema });
}
