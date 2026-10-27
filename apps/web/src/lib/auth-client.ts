import { createAuthClient } from "better-auth/client";

// Cliente oficial do Better Auth (decisão TL1-A): sabe chamar as rotas de
// cadastro, login e logout da API (/api/auth/...) e cuida dos cookies.
// Como o front e a API ficam no mesmo endereço (proxy do Vite e Nginx),
// basta informar o caminho.
export const authClient = createAuthClient({
  basePath: "/api/auth",
});
