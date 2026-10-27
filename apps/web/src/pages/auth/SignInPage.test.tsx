import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authClient } from "../../lib/auth-client.ts";
import { signInAction } from "./actions.ts";
import { SignInPage } from "./SignInPage.tsx";

// Troca o cliente do Better Auth por uma versão "de mentira": o teste decide
// o que ele responde, sem precisar da API rodando.
vi.mock("../../lib/auth-client.ts", () => ({
  authClient: { signIn: { email: vi.fn() } },
}));
const signInEmail = vi.mocked(authClient.signIn.email);

// Desenha a tela de entrar dentro de um roteador de teste, com a página inicial
// como destino depois do login.
function renderSignIn() {
  const Stub = createRoutesStub([
    { path: "/entrar", Component: SignInPage, action: signInAction },
    { path: "/", Component: () => <p>Página inicial</p> },
  ]);
  render(<Stub initialEntries={["/entrar"]} />);
}

describe("Tela de entrar", () => {
  beforeEach(() => {
    signInEmail.mockReset();
  });

  it("mostra os erros ao enviar com tudo vazio, sem chamar a API", async () => {
    renderSignIn();
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Informe um e-mail válido.")).toBeVisible();
    expect(screen.getByText("Informe sua senha.")).toBeVisible();
    // O cursor vai para o primeiro campo com erro (decisão TL4-A).
    expect(screen.getByLabelText("E-mail")).toHaveFocus();
    expect(signInEmail).not.toHaveBeenCalled();
  });

  it("mostra a mensagem em português quando a senha está errada", async () => {
    signInEmail.mockResolvedValue({
      data: null,
      error: { code: "INVALID_EMAIL_OR_PASSWORD", status: 401 },
    } as never);

    renderSignIn();
    await userEvent.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Senha"), "senha-errada");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(
      await screen.findByText("E-mail ou senha incorretos."),
    ).toBeVisible();
  });

  it("vai para a página inicial quando o login dá certo", async () => {
    signInEmail.mockResolvedValue({ data: {}, error: null } as never);

    renderSignIn();
    await userEvent.type(screen.getByLabelText("E-mail"), "ana@example.com");
    await userEvent.type(screen.getByLabelText("Senha"), "senha-certa");
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));

    expect(await screen.findByText("Página inicial")).toBeVisible();
    expect(signInEmail).toHaveBeenCalledWith({
      email: "ana@example.com",
      password: "senha-certa",
    });
  });

  it("mostra a senha ao marcar a caixa", async () => {
    renderSignIn();
    const password = screen.getByLabelText("Senha");
    expect(password).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByLabelText("Mostrar senha"));
    expect(password).toHaveAttribute("type", "text");
  });
});
