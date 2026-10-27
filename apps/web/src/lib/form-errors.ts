import { z } from "zod";

// Transforma os erros do Zod em { campo: "primeira mensagem" },
// o formato que as telas usam para mostrar cada erro embaixo do seu campo.
export function firstErrorPerField(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string[] | undefined> =
    z.flattenError(error).fieldErrors;
  const result: Record<string, string> = {};
  for (const [field, errors] of Object.entries(fieldErrors)) {
    if (errors && errors.length > 0) {
      result[field] = errors[0];
    }
  }
  return result;
}
