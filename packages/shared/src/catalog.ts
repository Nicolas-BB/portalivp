// Formatos das respostas das rotas públicas da API (decisão HP9).
// O front e a API usam os mesmos tipos, para nunca discordarem do formato.

// GET /api/categories
export type CategoryItem = {
  id: string;
  name: string;
  // Usado no endereço do filtro, ex.: /?categoria=pet-shop (decisão HP11-B).
  slug: string;
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

// Os valores das listas fixas do banco (os enum do Postgres).
export type ServiceType = "in_person" | "online" | "delivery" | "pickup";
export type PaymentMethod =
  "cash" | "pix" | "credit_card" | "debit_card" | "meal_voucher";
export type ContactType = "phone" | "whatsapp" | "email";
export type SocialPlatform = "instagram" | "facebook" | "tiktok" | "website";

// Uma faixa de horário. weekday: 0 = domingo ... 6 = sábado (P3).
// Horários no formato "08:00".
export type OpeningHoursRange = {
  weekday: number;
  opensAt: string;
  closesAt: string;
};

// Um produto, como a página da loja mostra.
export type ProductItem = {
  id: string;
  name: string;
  description: string | null;
  // null = "Consulte o preço" (P5).
  price: number | null;
  // Nome da categoria do produto (DR3).
  category: string;
  // Nome do arquivo da primeira foto, ou null se o produto não tem fotos.
  image: string | null;
};

// GET /api/companies/:id: tudo o que a página da loja mostra (decisão PG2).
export type CompanyDetails = {
  id: string;
  name: string;
  description: string;
  // Nome do arquivo do logo, ou null (DR2).
  logoImage: string | null;
  // Nomes dos arquivos das fotos, em ordem; a primeira é a capa (P10).
  images: string[];
  categories: CategoryItem[];
  neighborhood: string;
  address: {
    street: string;
    number: string;
    complement: string | null;
    cep: string;
  };
  // Ponto no mapa, ou null se a loja não marcou (P2-B).
  location: { latitude: number; longitude: number } | null;
  openingHours: OpeningHoursRange[];
  // Calculado pela API no horário de Brasília (LJ6-A).
  isOpenNow: boolean;
  serviceTypes: ServiceType[];
  paymentMethods: PaymentMethod[];
  contacts: { type: ContactType; value: string }[];
  socialLinks: { platform: SocialPlatform; url: string }[];
  // Só os produtos ativos, em ordem alfabética (PG7-A).
  products: ProductItem[];
};
