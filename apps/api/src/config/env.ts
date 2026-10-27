import { z } from "zod";

// Variáveis de ambiente que a API precisa para subir (decisão K5-A).
// Se alguma faltar ou estiver errada, a API nem sobe e mostra qual é.
export const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().positive().default(3000),
});

export type Env = z.infer<typeof envSchema>;
