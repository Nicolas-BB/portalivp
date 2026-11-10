import type { CompanyDetails } from "@portalivp/shared";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRoutesStub, type LoaderFunctionArgs } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { storeLoader } from "./loader.ts";
import { StoreErrorPage } from "./StoreErrorPage.tsx";
import { StorePage } from "./StorePage.tsx";

// Uma loja de exemplo, fictícia. Aberta só de segunda (8h–12h e 14h–18h).
const company: CompanyDetails = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Pet Shop Amigo Fiel",
  description: "Rações, acessórios, banho e tosa.",
  logoImage: null,
  images: [],
  categories: [{ id: "1", name: "Pet Shop", slug: "pet-shop" }],
  neighborhood: "Bairro Exemplo 4",
  address: {
    street: "Rua Exemplo",
    number: "400",
    complement: null,
    cep: "86870-000",
  },
  location: null,
  openingHours: [
    { weekday: 1, opensAt: "08:00", closesAt: "12:00" },
    { weekday: 1, opensAt: "14:00", closesAt: "18:00" },
  ],
  isOpenNow: true,
  serviceTypes: ["in_person", "delivery"],
  paymentMethods: ["pix", "meal_voucher"],
  contacts: [{ type: "whatsapp", value: "(43) 90000-0004" }],
  socialLinks: [
    { platform: "website", url: "https://example.com/loja-4" },
    // Um link perigoso não pode virar link na página.
    { platform: "instagram", url: "javascript:alert(1)" },
  ],
  products: [
    {
      id: "p1",
      name: "Banho e tosa",
      description: null,
      price: null,
      category: "Serviços",
      image: null,
    },
    {
      id: "p2",
      name: "Ração para cães 10 kg",
      description: "Para cães adultos.",
      price: 119.9,
      category: "Pet",
      image: null,
    },
  ],
};

// Desenha a página com o loader de verdade e uma API de mentira, que devolve
// a loja dada (ou 404, se for null).
function renderStore(store: CompanyDetails | null = company) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve(
        store ? Response.json(store) : new Response(null, { status: 404 }),
      ),
    ),
  );
  const Stub = createRoutesStub([
    {
      path: "/lojas/:id",
      Component: StorePage,
      ErrorBoundary: StoreErrorPage,
      loader: (args: LoaderFunctionArgs) => storeLoader(args),
    },
  ]);
  render(<Stub initialEntries={[`/lojas/${company.id}`]} />);
}

describe("Página da loja", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("mostra os dados da loja vindos da API", async () => {
    renderStore();

    expect(
      await screen.findByRole("heading", { name: "Pet Shop Amigo Fiel" }),
    ).toBeVisible();
    expect(screen.getByText("Aberto agora")).toBeVisible();
    // A inicial no lugar do logo, e o endereço numa linha.
    expect(screen.getByText("P")).toBeVisible();
    expect(
      screen.getByText("Rua Exemplo, 400 – Bairro Exemplo 4 – Ivaiporã, PR"),
    ).toBeVisible();
    // Formas de pagamento e atendimento em português.
    expect(screen.getByText("Vale-alimentação")).toBeVisible();
    expect(screen.getByText("Entrega")).toBeVisible();
    // Preço em reais, ou "Consulte o preço".
    expect(screen.getByText(/R\$\s119,90/)).toBeVisible();
    expect(screen.getByText("Consulte o preço")).toBeVisible();
    // Produtos em ordem alfabética, como vêm da API.
    const names = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(names.slice(0, 2)).toEqual([
      "Banho e tosa",
      "Ração para cães 10 kg",
    ]);
  });

  it("mostra o horário com as faixas do dia e Fechado nos outros dias", async () => {
    renderStore();

    const monday = (await screen.findByText(/^Segunda/)).closest("li");
    expect(monday).toHaveTextContent("8:00–12:00 e 14:00–18:00");
    const sunday = screen.getByText(/^Domingo/).closest("li");
    expect(sunday).toHaveTextContent("Fechado");
  });

  it("filtra os produtos pela categoria", async () => {
    renderStore();
    const filters = await screen.findByRole("group", {
      name: "Filtrar por categoria",
    });
    expect(
      within(filters).getByRole("button", { name: "Todos" }),
    ).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(within(filters).getByRole("button", { name: "Pet" }));

    expect(
      screen.getByRole("heading", { name: "Ração para cães 10 kg" }),
    ).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Banho e tosa" })).toBeNull();
  });

  it("mostra o botão de WhatsApp só quando a loja tem WhatsApp", async () => {
    renderStore();
    expect(
      await screen.findByRole("link", { name: "WhatsApp" }),
    ).toHaveAttribute("href", "https://wa.me/5543900000004");
    // A loja não informou telefone.
    expect(screen.queryByRole("link", { name: "Ligar" })).toBeNull();
  });

  it("mostra o botão Ligar e Fechado agora para outra loja", async () => {
    renderStore({
      ...company,
      isOpenNow: false,
      contacts: [{ type: "phone", value: "(43) 3000-0000" }],
    });

    expect(await screen.findByText("Fechado agora")).toBeVisible();
    expect(screen.getByRole("link", { name: "Ligar" })).toHaveAttribute(
      "href",
      "tel:+554330000000",
    );
    expect(screen.queryByRole("link", { name: "WhatsApp" })).toBeNull();
  });

  it("só transforma em link as redes com endereço da web", async () => {
    renderStore();
    expect(await screen.findByRole("link", { name: "Site" })).toHaveAttribute(
      "href",
      "https://example.com/loja-4",
    );
    expect(screen.queryByRole("link", { name: "Instagram" })).toBeNull();
  });

  it("avisa quando a loja não existe", async () => {
    renderStore(null);
    expect(
      await screen.findByRole("heading", { name: "Loja não encontrada" }),
    ).toBeVisible();
  });
});
