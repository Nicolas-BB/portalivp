import { categories, neighborhoods } from "../schema/index.js";
import { connectStandalone } from "../standalone.js";

// Script inicial (npm run db:seed): preenche as listas fixas.
// Roda no desenvolvimento e na produção (decisão N7-A).
// Pode rodar mais de uma vez: o que já existe é ignorado.

// As 8 categorias do protótipo (decisão M5-B).
const categoryNames = [
  "Alimentação",
  "Restaurantes",
  "Mercados",
  "Pet Shop",
  "Saúde",
  "Beleza",
  "Moda",
  "Serviços",
];

// Bairros fictícios até a lista oficial de Ivaiporã chegar (PI-32, decisão E1-A).
const neighborhoodNames = [
  "Bairro Exemplo 1",
  "Bairro Exemplo 2",
  "Bairro Exemplo 3",
  "Bairro Exemplo 4",
  "Bairro Exemplo 5",
  "Bairro Exemplo 6",
];

const db = connectStandalone();

try {
  await db
    .insert(categories)
    .values(categoryNames.map((name) => ({ name })))
    .onConflictDoNothing();

  await db
    .insert(neighborhoods)
    .values(neighborhoodNames.map((name) => ({ name })))
    .onConflictDoNothing();

  console.log(
    `Pronto: ${categoryNames.length} categorias e ${neighborhoodNames.length} bairros.`,
  );
} finally {
  await db.$client.end();
}
