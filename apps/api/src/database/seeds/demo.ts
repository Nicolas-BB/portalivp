import { inArray } from "drizzle-orm";
import {
  categories,
  companies,
  companyCategories,
  companyPaymentMethods,
  companyServiceTypes,
  contactChannels,
  neighborhoods,
  openingHours,
  productCategories,
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
  paymentMethods: (
    "cash" | "pix" | "credit_card" | "debit_card" | "meal_voucher"
  )[];
  whatsapp: string;
  // Opcionais: algumas lojas têm, para a página da loja mostrar tudo o que
  // sabe fazer na apresentação (decisão ML0-A).
  complement?: string;
  // Um ponto perto do centro de Ivaiporã, para o "Ver no mapa" (P2-B).
  location?: { latitude: number; longitude: number };
  phone?: string;
  email?: string;
  socialLinks?: {
    platform: "instagram" | "facebook" | "tiktok" | "website";
    url: string;
  }[];
  // Preço vazio (null) aparece como "Consulte o preço" (P5).
  // category: o nome de uma categoria de produto do script inicial.
  products: {
    name: string;
    price: number | null;
    category: string;
    description?: string;
  }[];
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
    paymentMethods: ["cash", "pix", "debit_card", "meal_voucher"],
    whatsapp: "(43) 90000-0001",
    location: { latitude: -24.2468, longitude: -51.6849 },
    phone: "(43) 90000-1001",
    socialLinks: [
      { platform: "facebook", url: "https://example.com/facebook/padaria" },
    ],
    products: [
      {
        name: "Pão francês (kg)",
        price: 16.9,
        category: "Alimentos",
        description: "Sai do forno às 6h, às 11h e às 16h.",
      },
      {
        name: "Bolo de fubá",
        price: 22,
        category: "Alimentos",
        description: "Receita da casa, com erva-doce.",
      },
      {
        name: "Torta salgada sob encomenda",
        price: null,
        category: "Alimentos",
        description: "Frango ou palmito. Encomende com um dia de antecedência.",
      },
      {
        name: "Suco de laranja (500 ml)",
        price: 9,
        category: "Bebidas",
      },
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
    paymentMethods: [
      "cash",
      "pix",
      "credit_card",
      "debit_card",
      "meal_voucher",
    ],
    whatsapp: "(43) 90000-0002",
    email: "sabordacasa@example.com",
    socialLinks: [
      { platform: "instagram", url: "https://example.com/instagram/sabor" },
    ],
    products: [
      { name: "Marmita média", price: 22, category: "Alimentos" },
      { name: "Prato executivo", price: 29.9, category: "Alimentos" },
      { name: "Feijoada (aos sábados)", price: 39.9, category: "Alimentos" },
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
    paymentMethods: [
      "cash",
      "pix",
      "credit_card",
      "debit_card",
      "meal_voucher",
    ],
    whatsapp: "(43) 90000-0003",
    products: [
      { name: "Arroz 5 kg", price: 27.9, category: "Alimentos" },
      { name: "Feijão 1 kg", price: 8.49, category: "Alimentos" },
      { name: "Café 500 g", price: 18.9, category: "Bebidas" },
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
    paymentMethods: ["cash", "pix", "credit_card", "debit_card"],
    whatsapp: "(43) 90000-0004",
    // A loja mais completa: a melhor para a demonstração.
    complement: "Sala 2",
    location: { latitude: -24.2491, longitude: -51.6823 },
    phone: "(43) 90000-1004",
    email: "amigofiel@example.com",
    socialLinks: [
      { platform: "instagram", url: "https://example.com/instagram/amigofiel" },
      { platform: "tiktok", url: "https://example.com/tiktok/amigofiel" },
    ],
    products: [
      {
        name: "Ração para cães 10 kg",
        price: 119.9,
        category: "Pet",
        description: "Para cães adultos de porte médio.",
      },
      {
        name: "Banho e tosa",
        price: null,
        category: "Serviços",
        description: "O preço depende do porte. Agende pelo WhatsApp.",
      },
      {
        name: "Coleira ajustável",
        price: 24.9,
        category: "Pet",
        description: "Tamanhos P, M e G.",
      },
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
    paymentMethods: ["cash", "pix", "debit_card"],
    whatsapp: "(43) 90000-0005",
    products: [
      { name: "Corte feminino", price: 60, category: "Serviços" },
      { name: "Manicure", price: 35, category: "Serviços" },
      { name: "Escova", price: null, category: "Serviços" },
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
    paymentMethods: ["pix", "credit_card", "debit_card"],
    whatsapp: "(43) 90000-0006",
    products: [
      { name: "Camiseta básica", price: 39.9, category: "Roupas e calçados" },
      { name: "Calça jeans", price: 129.9, category: "Roupas e calçados" },
      { name: "Vestido", price: 99.9, category: "Roupas e calçados" },
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
    const allProductCategories = await tx.select().from(productCategories);
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
          complement: store.complement,
          neighborhoodId: findId(allNeighborhoods, store.neighborhoodName),
          latitude: store.location?.latitude,
          longitude: store.location?.longitude,
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

      await tx.insert(companyPaymentMethods).values(
        store.paymentMethods.map((method) => ({
          companyId: company.id,
          method,
        })),
      );

      await tx
        .insert(openingHours)
        .values(
          demoHours.map((hours) => ({ ...hours, companyId: company.id })),
        );

      // Contatos: o WhatsApp, que todas têm, e o telefone e o e-mail, se tiverem.
      const contacts: (typeof contactChannels.$inferInsert)[] = [
        { companyId: company.id, type: "whatsapp", value: store.whatsapp },
      ];
      if (store.phone) {
        contacts.push({
          companyId: company.id,
          type: "phone",
          value: store.phone,
        });
      }
      if (store.email) {
        contacts.push({
          companyId: company.id,
          type: "email",
          value: store.email,
        });
      }
      await tx.insert(contactChannels).values(contacts);

      // Links fictícios: o domínio example.com é reservado para exemplos.
      // Todas têm um site; algumas também têm redes sociais.
      const links: (typeof socialLinks.$inferInsert)[] = [
        {
          companyId: company.id,
          platform: "website",
          url: `https://example.com/loja-${index + 1}`,
        },
      ];
      for (const link of store.socialLinks ?? []) {
        links.push({ ...link, companyId: company.id });
      }
      await tx.insert(socialLinks).values(links);

      await tx.insert(products).values(
        store.products.map((product) => ({
          companyId: company.id,
          categoryId: findId(allProductCategories, product.category),
          name: product.name,
          description: product.description,
          price: product.price,
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
