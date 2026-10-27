import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import { drizzle } from "drizzle-orm/node-postgres";

// Configuração do Better Auth (decisões S2-A e N1-A):
// - tabelas com nomes no plural (users, sessions, accounts, verifications);
// - IDs em UUID gerados pelo banco;
// - plugin admin, que acrescenta o papel de administrador.
//
// Por enquanto, este arquivo só serve para o comando do Better Auth gerar
// o schema das tabelas (npm run auth:generate). As rotas de cadastro e
// login são ligadas à API no PI-10.
export const auth = betterAuth({
  database: drizzleAdapter(drizzle(process.env.DATABASE_URL ?? ""), {
    provider: "pg",
    usePlural: true,
  }),
  advanced: {
    database: { generateId: "uuid" },
  },
  plugins: [admin()],
});
