import { signInSchema, signUpSchema } from "@portalivp/shared";
import { data, redirect, type ActionFunctionArgs } from "react-router";
import { authClient } from "../../lib/auth-client.ts";
import { translateAuthError } from "../../lib/auth-errors.ts";
import { fetchCurrentUser } from "../../lib/current-user.ts";
import { firstErrorPerField } from "../../lib/form-errors.ts";

// O que a tela recebe de volta quando algo dá errado.
export type AuthActionResult = {
  // Erro de um campo específico, mostrado embaixo dele (ex.: e-mail inválido).
  fieldErrors?: Record<string, string>;
  // Erro do formulário todo, mostrado num quadro (ex.: senha errada).
  formError?: string;
};

// Envio do formulário de entrar (I3-C): valida, chama o Better Auth e, se deu
// certo, vai para a página inicial (TL6-A). Responder com erro (400 ou mais)
// também avisa o React Router de que nada mudou (não precisa recarregar quem está logado).
export async function signInAction({ request }: ActionFunctionArgs) {
  const form = Object.fromEntries(await request.formData());
  const parsed = signInSchema.safeParse(form);
  if (!parsed.success) {
    return data<AuthActionResult>(
      { fieldErrors: firstErrorPerField(parsed.error) },
      { status: 400 },
    );
  }

  const { error } = await authClient.signIn.email(parsed.data);
  if (error) {
    return data<AuthActionResult>(
      { formError: translateAuthError(error) },
      { status: error.status || 400 },
    );
  }
  return redirect("/");
}

// Envio do formulário de cadastrar: igual ao de entrar. O Better Auth já faz
// o login logo depois do cadastro (decisão AU4-A).
export async function signUpAction({ request }: ActionFunctionArgs) {
  const form = Object.fromEntries(await request.formData());
  const parsed = signUpSchema.safeParse(form);
  if (!parsed.success) {
    return data<AuthActionResult>(
      { fieldErrors: firstErrorPerField(parsed.error) },
      { status: 400 },
    );
  }

  const { error } = await authClient.signUp.email(parsed.data);
  if (error) {
    return data<AuthActionResult>(
      { formError: translateAuthError(error) },
      { status: error.status || 400 },
    );
  }
  return redirect("/");
}

// Botão "Sair" do cabeçalho.
export async function signOutAction() {
  await authClient.signOut();
  return redirect("/");
}

// Quem já está logado e abre /entrar ou /cadastrar vai para a página inicial (TL7).
export async function redirectIfSignedIn() {
  const user = await fetchCurrentUser();
  if (user) {
    throw redirect("/");
  }
  return null;
}
