import {
  categories,
  neighborhoods,
  productCategories,
} from "../schema/index.js";
import { connectForScripts } from "../script-connection.js";

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

// Categorias de produto: uma lista única para todas as lojas (decisões LJ5-A e DR3).
// Nomes provisórios até o grupo definir a lista. "Outros" é para o que não se encaixa.
const productCategoryNames = [
  "Alimentos",
  "Bebidas",
  "Roupas e calçados",
  "Acessórios",
  "Beleza e higiene",
  "Pet",
  "Casa",
  "Serviços",
  "Outros",
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

const db = connectForScripts();

try {
  await db
    .insert(categories)
    .values(categoryNames.map((name) => ({ name })))
    .onConflictDoNothing();

  await db
    .insert(productCategories)
    .values(productCategoryNames.map((name) => ({ name })))
    .onConflictDoNothing();

  await db
    .insert(neighborhoods)
    .values(neighborhoodNames.map((name) => ({ name })))
    .onConflictDoNothing();

  console.log(
    `Pronto: ${categoryNames.length} categorias de loja, ` +
      `${productCategoryNames.length} categorias de produto e ` +
      `${neighborhoodNames.length} bairros.`,
  );
} finally {
  await db.$client.end();
}
