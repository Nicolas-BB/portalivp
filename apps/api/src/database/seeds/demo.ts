import { inArray } from "drizzle-orm";
import {
  categories,
  companies,
  companyCategories,
  companyServiceTypes,
  contactChannels,
  neighborhoods,
  openingHours,
  products,
  socialLinks,
  users,
} from "../schema/index.js";
import { connectStandalone } from "../standalone.js";

// Dados de exemplo para o desenvolvimento e a apresentação (npm run db:seed:demo).
// NUNCA rode na produção (decisão N7-A). Todos os dados são fictícios.
// Pode rodar mais de uma vez: os dados de exemplo antigos são apagados e criados de novo.

const owners = [
  { name: "Ana Exemplo", email: "ana@example.com" },
  { name: "Bruno Exemplo", email: "bruno@example.com" },
];

type DemoStore = {
  ownerEmail: string;
  name: string;
  description: string;
  categoryNames: string[];
  neighborhoodName: string;
  number: string;
  serviceTypes: ("in_person" | "online" | "delivery" | "pickup")[];
  whatsapp: string;
  // Preço vazio (null) aparece como "Consulte o preço" (P5).
  products: { name: string; price: number | null }[];
};

const stores: DemoStore[] = [
  {
    ownerEmail: "ana@example.com",
    name: "Padaria Pão Quente",
    description: "Pães fresquinhos o dia todo, bolos caseiros e salgados.",
    categoryNames: ["Alimentação"],
    neighborhoodName: "Bairro Exemplo 1",
    number: "100",
    serviceTypes: ["in_person", "pickup"],
    whatsapp: "(43) 90000-0001",
    products: [
      { name: "Pão francês (kg)", price: 16.9 },
      { name: "Bolo de fubá", price: 22 },
      { name: "Torta salgada sob encomenda", price: null },
    ],
  },
  {
    ownerEmail: "ana@example.com",
    name: "Restaurante Sabor da Casa",
    description: "Comida caseira, marmitas e prato executivo no almoço.",
    categoryNames: ["Restaurantes", "Alimentação"],
    neighborhoodName: "Bairro Exemplo 2",
    number: "200",
    serviceTypes: ["in_person", "delivery"],
    whatsapp: "(43) 90000-0002",
    products: [
      { name: "Marmita média", price: 22 },
      { name: "Prato executivo", price: 29.9 },
      { name: "Feijoada (aos sábados)", price: 39.9 },
    ],
  },
  {
    ownerEmail: "ana@example.com",
    name: "Mercado Bom Preço",
    description: "Mercearia, hortifrúti e produtos de limpeza.",
    categoryNames: ["Mercados", "Alimentação"],
    neighborhoodName: "Bairro Exemplo 3",
    number: "300",
    serviceTypes: ["in_person", "delivery"],
    whatsapp: "(43) 90000-0003",
    products: [
      { name: "Arroz 5 kg", price: 27.9 },
      { name: "Feijão 1 kg", price: 8.49 },
      { name: "Café 500 g", price: 18.9 },
    ],
  },
  {
    ownerEmail: "bruno@example.com",
    name: "Pet Shop Amigo Fiel",
    description: "Rações, acessórios, banho e tosa.",
    categoryNames: ["Pet Shop"],
    neighborhoodName: "Bairro Exemplo 4",
    number: "400",
    serviceTypes: ["in_person", "delivery"],
    whatsapp: "(43) 90000-0004",
    products: [
      { name: "Ração para cães 10 kg", price: 119.9 },
      { name: "Banho e tosa", price: null },
      { name: "Coleira ajustável", price: 24.9 },
    ],
  },
  {
    ownerEmail: "bruno@example.com",
    name: "Salão Beleza Pura",
    description: "Cortes, escovas, manicure e pedicure.",
    categoryNames: ["Beleza"],
    neighborhoodName: "Bairro Exemplo 5",
    number: "500",
    serviceTypes: ["in_person"],
    whatsapp: "(43) 90000-0005",
    products: [
      { name: "Corte feminino", price: 60 },
      { name: "Manicure", price: 35 },
      { name: "Escova", price: null },
    ],
  },
  {
    ownerEmail: "bruno@example.com",
    name: "Moda & Estilo",
    description: "Roupas femininas e masculinas para o dia a dia.",
    categoryNames: ["Moda"],
    neighborhoodName: "Bairro Exemplo 6",
    number: "600",
    serviceTypes: ["in_person", "online"],
    whatsapp: "(43) 90000-0006",
    products: [
      { name: "Camiseta básica", price: 39.9 },
      { name: "Calça jeans", price: 129.9 },
      { name: "Vestido", price: 99.9 },
    ],
  },
];

// Segunda a sexta: 8h–12h e 14h–18h. Sábado: 8h–12h. Domingo: fechado.
const demoHours = [
  ...[1, 2, 3, 4, 5].flatMap((weekday) => [
    { weekday, opensAt: "08:00", closesAt: "12:00" },
    { weekday, opensAt: "14:00", closesAt: "18:00" },
  ]),
  { weekday: 6, opensAt: "08:00", closesAt: "12:00" },
];

// Procura o id pelo nome numa lista; se não achar, para com uma mensagem clara.
function findId(list: { id: string; name: string }[], name: string): string {
  const item = list.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(
      `"${name}" não existe no banco. Rode antes: npm run db:seed`,
    );
  }
  return item.id;
}

const db = connectStandalone();

try {
  // Tudo ou nada: se algo falhar no meio, nada fica gravado pela metade.
  await db.transaction(async (tx) => {
    // Recomeça do zero: apagar os donos de exemplo apaga as lojas deles (cascata, N4-A).
    await tx.delete(users).where(
      inArray(
        users.email,
        owners.map((owner) => owner.email),
      ),
    );

    const allCategories = await tx.select().from(categories);
    const allNeighborhoods = await tx.select().from(neighborhoods);
    const createdOwners = await tx.insert(users).values(owners).returning();

    for (const [index, store] of stores.entries()) {
      const owner = createdOwners.find((u) => u.email === store.ownerEmail);
      if (!owner) {
        throw new Error(`Dono não encontrado: ${store.ownerEmail}`);
      }

      const [company] = await tx
        .insert(companies)
        .values({
          ownerId: owner.id,
          name: store.name,
          description: store.description,
          status: "active",
          cep: "86870-000",
          street: "Rua Exemplo",
          number: store.number,
          neighborhoodId: findId(allNeighborhoods, store.neighborhoodName),
        })
        .returning();

      await tx.insert(companyCategories).values(
        store.categoryNames.map((name) => ({
          companyId: company.id,
          categoryId: findId(allCategories, name),
        })),
      );

      await tx
        .insert(companyServiceTypes)
        .values(
          store.serviceTypes.map((type) => ({ companyId: company.id, type })),
        );

      await tx
        .insert(openingHours)
        .values(
          demoHours.map((hours) => ({ ...hours, companyId: company.id })),
        );

      await tx.insert(contactChannels).values({
        companyId: company.id,
        type: "whatsapp",
        value: store.whatsapp,
      });

      // Site fictício: o domínio example.com é reservado para exemplos.
      await tx.insert(socialLinks).values({
        companyId: company.id,
        platform: "website",
        url: `https://example.com/loja-${index + 1}`,
      });

      await tx.insert(products).values(
        store.products.map((product) => ({
          ...product,
          companyId: company.id,
        })),
      );
    }
  });

  console.log(
    `Pronto: ${owners.length} donos e ${stores.length} lojas de exemplo.`,
  );
} finally {
  await db.$client.end();
}
