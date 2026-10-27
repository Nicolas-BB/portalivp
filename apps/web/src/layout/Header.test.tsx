import { render, screen } from "@testing-library/react";
import { createRoutesStub } from "react-router";
import { describe, expect, it } from "vitest";
import type { CurrentUser } from "../lib/current-user.ts";
import { Header } from "./Header.tsx";

// Desenha o cabeçalho com o loader "root" respondendo o usuário que o teste quiser.
function renderHeader(user: CurrentUser | null) {
  const Stub = createRoutesStub([
    { id: "root", path: "/", Component: Header, loader: () => user },
  ]);
  render(<Stub initialEntries={["/"]} />);
}

describe("Cabeçalho", () => {
  it("mostra Entrar e Cadastrar para quem não está logado", async () => {
    renderHeader(null);

    expect(await screen.findByRole("link", { name: "Entrar" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Cadastrar" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Sair" })).toBeNull();
  });

  it("mostra o primeiro nome e o botão Sair para quem está logado", async () => {
    renderHeader({
      id: "1",
      name: "Ana Exemplo",
      email: "ana@example.com",
      role: "user",
    });

    expect(await screen.findByText("Olá, Ana")).toBeVisible();
    expect(screen.getByRole("button", { name: "Sair" })).toBeVisible();
    expect(screen.queryByRole("link", { name: "Entrar" })).toBeNull();
  });
});
