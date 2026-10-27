import type { CategoryItem, CompanyCard } from "@portalivp/shared";
import type { LoaderFunctionArgs } from "react-router";
import { getJson } from "../../lib/api.ts";

export type HomeData = {
  categories: CategoryItem[];
  companies: CompanyCard[];
  // O slug da categoria escolhida no filtro (ex.: "pet-shop"), ou null para
  // "Todas" (decisões HP3-A e HP11-B).
  selectedCategory: string | null;
};

// Antes de mostrar a página inicial, busca as categorias e as lojas (I3-C).
// Roda de novo sozinho quando a parte ?categoria=... do endereço muda.
export async function homeLoader({
  request,
}: LoaderFunctionArgs): Promise<HomeData> {
  const selectedCategory = new URL(request.url).searchParams.get("categoria");
  const companiesPath = selectedCategory
    ? `/companies?category=${encodeURIComponent(selectedCategory)}`
    : "/companies";

  // As duas buscas ao mesmo tempo, para a página abrir mais rápido.
  const [categories, companies] = await Promise.all([
    getJson<CategoryItem[]>("/categories"),
    getJson<CompanyCard[]>(companiesPath),
  ]);

  return { categories, companies, selectedCategory };
}
