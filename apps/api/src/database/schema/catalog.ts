import { pgTable, text, uuid } from "drizzle-orm/pg-core";

// Listas fixas, preenchidas pelo script inicial (npm run db:seed).

// Bairros de Ivaiporã (decisões P11-B e P12-A).
export const neighborhoods = pgTable("neighborhoods", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
});

// Categorias das empresas, como Alimentação e Pet Shop (decisão M5-B).
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});
