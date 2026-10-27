import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins/admin";
import type { Database } from "../database/database.module.js";

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

type AuthSettings = {
  // Endereço do site, como o navegador vê (decisões AU6-A e AU7).
  baseURL: string;
  // Segredo que assina os cookies de login (decisão AU7).
  secret: string;
};

// Configuração do Better Auth (decisões S2-A e AU1 a AU8).
// As rotas de cadastro, login e logout ficam em /api/auth/... e são do próprio
// Better Auth: não escrevemos rota de login.
export function createAuth(db: Database, settings: AuthSettings) {
  return betterAuth({
    baseURL: settings.baseURL,
    basePath: "/api/auth",
    secret: settings.secret,
    // Tabelas no plural, ligadas pelo Drizzle (decisão N1-A).
    database: drizzleAdapter(db, { provider: "pg", usePlural: true }),
    emailAndPassword: {
      enabled: true,
      // Mínimo de 8 caracteres, sem exigir símbolos (decisão AU2-A).
      minPasswordLength: 8,
      // Sem confirmação de e-mail por enquanto: cadastrou, já entra (decisão AU4-A).
      autoSignIn: true,
    },
    session: {
      // Sessão de 7 dias, renovada a cada dia de uso (decisão AU3-A).
      expiresIn: 7 * ONE_DAY_IN_SECONDS,
      updateAge: ONE_DAY_IN_SECONDS,
    },
    advanced: {
      // IDs em UUID gerados pelo banco (decisões P8 e N2-A).
      database: { generateId: "uuid" },
      // IP real do visitante, enviado pelo Nginx na produção. O limite de
      // tentativas de login (ligado só na produção) usa este IP (decisão AU8-A).
      ipAddress: { ipAddressHeaders: ["x-real-ip"] },
      // Só aceita login, cadastro e logout vindos do próprio site (proteção
      // contra CSRF). O Better Auth já faz isso por padrão, MAS desliga sozinho
      // dentro dos testes; deixar explícito faz os testes provarem o
      // comportamento real da produção.
      disableOriginCheck: false,
    },
    // Papel de administrador (decisão M2-A).
    plugins: [admin()],
  });
}
