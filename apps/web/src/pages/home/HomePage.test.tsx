import type { CategoryItem, CompanyCard } from "@portalivp/shared";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, type LoaderFunctionArgs } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "./HomePage.tsx";
import { homeLoader } from "./loader.ts";

// Dados de exemplo, fictícios.
const categories: CategoryItem[] = [
  { id: "cat-pet", name: "Pet Shop" },
  { id: "cat-moda", name: "Moda" },
];

const companies: CompanyCard[] = [
  {
    id: "1",
    name: "Pet Shop Amigo Fiel",
    description: "Rações e banho e tosa.",
    neighborhood: "Bairro Exemplo 4",
    categories: ["Pet Shop"],
    coverImage: null,
  },
  {
    id: "2",
    name: "Moda & Estilo",
    description: "Roupas para o dia a dia.",
    neighborhood: "Bairro Exemplo 6",
    categories: ["Moda"],
    coverImage: null,
  },
];

// O endereço pedido ao fetch, venha ele como texto, URL ou Request.
function toUrl(input: RequestInfo | URL): URL {
  const href = input instanceof Request ? input.url : input.toString();
  return new URL(href, "http://localhost");
}

// Uma API "de mentira": responde as categorias e as lojas, filtrando pela
// categoria do endereço, como a API de verdade faria.
function fakeFetch(input: RequestInfo | URL) {
  const url = toUrl(input);
  if (url.pathname === "/api/categories") {
    return Promise.resolve(Response.json(categories));
  }
  const categoryId = url.searchParams.get("category");
  const category = categories.find((c) => c.id === categoryId);
  const result = category
    ? companies.filter((c) => c.categories.includes(category.name))
    : companies;
  return Promise.resolve(Response.json(result));
}

// Desenha a página inicial com o loader de verdade, usando a API de mentira.
function renderHome(path = "/", fetchImpl = fakeFetch) {
  vi.stubGlobal("fetch", vi.fn(fetchImpl));
  const Stub = createRoutesStub([
    {
      path: "/",
      Component: HomePage,
      loader: (args: LoaderFunctionArgs) => homeLoader(args),
    },
  ]);
  render(<Stub initialEntries={[path]} />);
}

describe("Página inicial", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mostra as categorias e as lojas vindas da API", async () => {
    renderHome();

    expect(
      await screen.findByRole("heading", { name: "Pet Shop Amigo Fiel" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Moda & Estilo" }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Pet Shop" })).toBeVisible();
    // "Todas" começa escolhida.
    expect(screen.getByRole("link", { name: "Todas" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("filtra as lojas ao clicar numa categoria", async () => {
    renderHome();
    await userEvent.click(await screen.findByRole("link", { name: "Moda" }));

    expect(
      await screen.findByRole("link", { name: "Moda", current: "page" }),
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Moda & Estilo" }),
    ).toBeVisible();
    expect(
      screen.queryByRole("heading", { name: "Pet Shop Amigo Fiel" }),
    ).toBeNull();
  });

  it("avisa quando não há lojas na categoria, com o botão Ver todas", async () => {
    renderHome("/?categoria=cat-inexistente", (input) => {
      const url = toUrl(input);
      return Promise.resolve(
        Response.json(url.pathname === "/api/categories" ? categories : []),
      );
    });

    expect(
      await screen.findByText("Nenhuma loja nesta categoria ainda."),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Ver todas" })).toBeVisible();
  });

  it("avisa quando o portal ainda não tem lojas", async () => {
    renderHome("/", (input) => {
      const url = toUrl(input);
      return Promise.resolve(
        Response.json(url.pathname === "/api/categories" ? categories : []),
      );
    });

    expect(
      await screen.findByText("Ainda não há lojas no portal. Volte em breve!"),
    ).toBeVisible();
  });
});
