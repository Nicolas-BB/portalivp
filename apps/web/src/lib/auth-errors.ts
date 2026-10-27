// O Better Auth responde os erros em inglês, com um código (ex.: INVALID_EMAIL_OR_PASSWORD).
// Aqui cada código vira uma mensagem em português para a pessoa (decisão TL5).

type AuthError = {
  code?: string;
  status?: number;
};

const messages: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha incorretos.",
  USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail. Tente entrar.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "Já existe uma conta com este e-mail. Tente entrar.",
};

export function translateAuthError(error: AuthError): string {
  // 429: o limite de tentativas da API foi atingido (decisão AU8-A).
  if (error.status === 429) {
    return "Muitas tentativas seguidas. Aguarde alguns segundos e tente de novo.";
  }
  if (error.code && messages[error.code]) {
    return messages[error.code];
  }
  return "Não foi possível concluir agora. Tente de novo em instantes.";
}
