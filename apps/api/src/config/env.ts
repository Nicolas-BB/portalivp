import { existsSync } from "node:fs";
import { z } from "zod";

// Variáveis de ambiente que a API precisa para subir (decisão K5-A).
// Se alguma faltar ou estiver errada, a API nem sobe e mostra qual é.
export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive().default(3000),
  // Segredo que assina os cookies de login (decisão AU7). Mínimo de 32 caracteres.
  BETTER_AUTH_SECRET: z.string().min(32),
  // Endereço do site, como o navegador vê (no desenvolvimento, o do front: AU6-A).
  BETTER_AUTH_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

// Para o que roda fora da API (scripts iniciais e comandos do Better Auth):
// lê o .env da raiz, se existir, e valida as variáveis.
// Na VPS, elas já chegam pelo Docker, sem arquivo.
export function loadEnv(): Env {
  const envFile = "../../.env";
  if (existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
  return envSchema.parse(process.env);
}
