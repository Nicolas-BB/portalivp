import type { CategoryItem, CompanyCard } from "@portalivp/shared";
import type { LoaderFunctionArgs } from "react-router";
import { getJson } from "../../lib/api.ts";

export type HomeData = {
  categories: CategoryItem[];
  companies: CompanyCard[];
  // A categoria escolhida no filtro, ou null para "Todas" (decisão HP3-A).
  selectedCategoryId: string | null;
};

// Antes de mostrar a página inicial, busca as categorias e as lojas (I3-C).
// Roda de novo sozinho quando a parte ?categoria=... do endereço muda.
export async function homeLoader({
  request,
}: LoaderFunctionArgs): Promise<HomeData> {
  const selectedCategoryId = new URL(request.url).searchParams.get("categoria");
  const companiesPath = selectedCategoryId
    ? `/companies?category=${encodeURIComponent(selectedCategoryId)}`
    : "/companies";

  // As duas buscas ao mesmo tempo, para a página abrir mais rápido.
  const [categories, companies] = await Promise.all([
    getJson<CategoryItem[]>("/categories"),
    getJson<CompanyCard[]>(companiesPath),
  ]);

  return { categories, companies, selectedCategoryId };
}
