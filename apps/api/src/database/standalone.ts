import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { loadEnv } from "../config/env.js";
import type { Database } from "./database.module.js";
import * as schema from "./schema/index.js";

// Conexão com o banco para o que roda fora da API: os scripts iniciais e os
// comandos do Better Auth. Usa a role do app (DATABASE_URL), que só lê e grava dados.
export function connectStandalone(): Database {
  const env = loadEnv();
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  return drizzle({ client: pool, schema });
}
