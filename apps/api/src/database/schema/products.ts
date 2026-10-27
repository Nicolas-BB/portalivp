import {
  boolean,
  index,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { companies } from "./companies.js";

// Produtos de cada empresa (decisão M1-A).
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    // Vazio = "Consulte o preço" (P5). Decimal exato, até 99.999.999,99 (N6-A).
    price: numeric("price", { precision: 10, scale: 2, mode: "number" }),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("products_company_id_idx").on(table.companyId)],
);

// Fotos do produto: até 5, conferido pela API (P4). A primeira é a capa (P10).
export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    fileName: text("file_name").notNull(),
    caption: text("caption"),
    position: smallint("position").notNull(),
  },
  (table) => [index("product_images_product_id_idx").on(table.productId)],
);
