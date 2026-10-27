import { defineConfig } from "drizzle-kit";

// Configuração do drizzle-kit, a ferramenta que gera e aplica as migrations.
// Lê o .env da raiz e conecta com a role DONA do banco, a única que pode
// criar e alterar tabelas (decisão K3-A).
process.loadEnvFile("../../.env");

const ownerUrl = process.env.DATABASE_OWNER_URL;
if (!ownerUrl) {
  throw new Error("Falta a variável DATABASE_OWNER_URL no .env da raiz.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema/index.ts",
  out: "./drizzle",
  dbCredentials: { url: ownerUrl },
});
