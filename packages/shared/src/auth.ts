import { z } from "zod";

// Regras dos campos de cadastro e login (decisão TL3).
// O front confere antes de enviar; o Better Auth confere de novo no servidor.

// Limites da senha: mínimo da decisão AU2-A; máximo do Better Auth.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(100, "O nome pode ter no máximo 100 caracteres."),
  email: z.email("Informe um e-mail válido."),
  password: z
    .string()
    .min(
      PASSWORD_MIN_LENGTH,
      `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
    )
    .max(
      PASSWORD_MAX_LENGTH,
      `A senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`,
    ),
});

// No login, só conferimos se a senha foi preenchida: quem decide se ela está
// certa é o Better Auth.
export const signInSchema = z.object({
  email: z.email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
