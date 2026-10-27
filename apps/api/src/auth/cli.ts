import { loadEnv } from "../config/env.js";
import { connectStandalone } from "../database/standalone.js";
import { createAuth } from "./auth.js";

// Usado só pelos comandos do Better Auth, que rodam fora da API:
// - npm run auth:generate -w @portalivp/api    (gera o schema das tabelas)
// - npm run auth:create-admin                  (cria o administrador, decisão AU5-A)
const env = loadEnv();

export const auth = createAuth(connectStandalone(), {
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
});
