import { describe, expect, it } from "vitest";
import { translateAuthError } from "./auth-errors.ts";

describe("translateAuthError", () => {
  it("traduz e-mail ou senha errados", () => {
    expect(
      translateAuthError({ code: "INVALID_EMAIL_OR_PASSWORD", status: 401 }),
    ).toBe("E-mail ou senha incorretos.");
  });

  it("traduz e-mail já cadastrado", () => {
    expect(
      translateAuthError({
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
        status: 422,
      }),
    ).toBe("Já existe uma conta com este e-mail. Tente entrar.");
  });

  it("avisa quando o limite de tentativas é atingido", () => {
    expect(translateAuthError({ status: 429 })).toBe(
      "Muitas tentativas seguidas. Aguarde alguns segundos e tente de novo.",
    );
  });

  it("usa uma mensagem genérica para erros desconhecidos", () => {
    expect(translateAuthError({ code: "ALGO_NOVO", status: 500 })).toBe(
      "Não foi possível concluir agora. Tente de novo em instantes.",
    );
  });
});
