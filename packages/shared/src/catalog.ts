// Formatos das respostas das rotas públicas da API (decisão HP9).
// O front e a API usam os mesmos tipos, para nunca discordarem do formato.

// GET /api/categories
export type CategoryItem = {
  id: string;
  name: string;
};

// Um item de GET /api/companies: o que o cartão da loja mostra.
export type CompanyCard = {
  id: string;
  name: string;
  description: string;
  // Nome do bairro.
  neighborhood: string;
  // Nomes das categorias, em ordem alfabética.
  categories: string[];
  // Nome do arquivo da foto de capa, ou null se a loja não tem fotos.
  coverImage: string | null;
};
