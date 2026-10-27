import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authClient } from "../../lib/auth-client.ts";
import { signUpAction } from "./actions.ts";
import { SignUpPage } from "./SignUpPage.tsx";

vi.mock("../../lib/auth-client.ts", () => ({
  authClient: { signUp: { email: vi.fn() } },
}));
const signUpEmail = vi.mocked(authClient.signUp.email);

function renderSignUp() {
  const Stub = createRoutesStub([
    { path: "/cadastrar", Component: SignUpPage, action: signUpAction },
    { path: "/", Component: () => <p>Página inicial</p> },
  ]);
  render(<Stub initialEntries={["/cadastrar"]} />);
}

async function fillForm(name: string, email: string, password: string) {
  await userEvent.type(screen.getByLabelText("Nome completo"), name);
  await userEvent.type(screen.getByLabelText("E-mail"), email);
  await userEvent.type(screen.getByLabelText("Senha"), password);
  await userEvent.click(
    screen.getByRole("button", { name: "Criar minha conta" }),
  );
}

describe("Tela de cadastrar", () => {
  beforeEach(() => {
    signUpEmail.mockReset();
  });

  it("recusa senha com menos de 8 caracteres, sem chamar a API", async () => {
    renderSignUp();
    await fillForm("Ana Exemplo", "ana@example.com", "1234567");

    expect(
      await screen.findByText("A senha precisa ter pelo menos 8 caracteres."),
    ).toBeVisible();
    expect(screen.getByLabelText("Senha")).toHaveFocus();
    expect(signUpEmail).not.toHaveBeenCalled();
  });

  it("avisa quando o e-mail já tem conta", async () => {
    signUpEmail.mockResolvedValue({
      data: null,
      error: { code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL", status: 422 },
    } as never);

    renderSignUp();
    await fillForm("Ana Exemplo", "ana@example.com", "senha-forte");

    expect(
      await screen.findByText(
        "Já existe uma conta com este e-mail. Tente entrar.",
      ),
    ).toBeVisible();
  });

  it("cadastra e vai para a página inicial", async () => {
    signUpEmail.mockResolvedValue({ data: {}, error: null } as never);

    renderSignUp();
    await fillForm("Ana Exemplo", "ana@example.com", "senha-forte");

    expect(await screen.findByText("Página inicial")).toBeVisible();
    expect(signUpEmail).toHaveBeenCalledWith({
      name: "Ana Exemplo",
      email: "ana@example.com",
      password: "senha-forte",
    });
  });
});
