import { sql } from "drizzle-orm";
import {
  check,
  index,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  time,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { categories, neighborhoods } from "./catalog.js";

// Status da empresa (decisões M3-B, M7-B e M9-B). Só "active" aparece ao público.
export const companyStatus = pgEnum("company_status", [
  "pending",
  "active",
  "inactive",
  "rejected",
  "suspended",
]);

// Formas de atendimento: presencial, online, entrega e retirada.
export const serviceType = pgEnum("service_type", [
  "in_person",
  "online",
  "delivery",
  "pickup",
]);

// Meios de contato.
export const contactType = pgEnum("contact_type", [
  "phone",
  "whatsapp",
  "email",
]);

// Redes sociais e site (decisão P6).
export const socialPlatform = pgEnum("social_platform", [
  "instagram",
  "facebook",
  "tiktok",
  "website",
]);

export const companies = pgTable(
  "companies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // Um dono por empresa (M4-A). Apagar o usuário apaga as empresas dele (P7).
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    status: companyStatus("status").notNull().default("pending"),
    // Motivo da recusa ou da suspensão (P9).
    statusReason: text("status_reason"),
    // Endereço (P1). O portal é só de Ivaiporã (P12-A), sem cidade e estado.
    cep: text("cep").notNull(),
    street: text("street").notNull(),
    number: text("number").notNull(),
    complement: text("complement"),
    // Um bairro em uso não pode ser apagado (N4-A).
    neighborhoodId: uuid("neighborhood_id")
      .notNull()
      .references(() => neighborhoods.id, { onDelete: "restrict" }),
    // Ponto no mapa, opcional (P2-B).
    latitude: numeric("latitude", { precision: 9, scale: 6, mode: "number" }),
    longitude: numeric("longitude", { precision: 9, scale: 6, mode: "number" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("companies_owner_id_idx").on(table.ownerId),
    index("companies_neighborhood_id_idx").on(table.neighborhoodId),
    // Latitude e longitude vêm juntas ou ficam as duas vazias.
    check(
      "companies_location_check",
      sql`(${table.latitude} is null) = (${table.longitude} is null)`,
    ),
  ],
);

// Liga empresa e categoria: de 1 a 3 categorias por empresa (M10-B, conferido pela API).
export const companyCategories = pgTable(
  "company_categories",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    // Uma categoria em uso não pode ser apagada (N4-A).
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
  },
  (table) => [primaryKey({ columns: [table.companyId, table.categoryId] })],
);

// Faixas de horário: um dia pode ter várias (ex.: 8h–12h e 14h–18h).
// Um dia sem nenhuma faixa significa fechado (P3).
export const openingHours = pgTable(
  "opening_hours",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    // 0 = domingo, 1 = segunda ... 6 = sábado.
    weekday: smallint("weekday").notNull(),
    opensAt: time("opens_at").notNull(),
    closesAt: time("closes_at").notNull(),
  },
  (table) => [
    index("opening_hours_company_id_idx").on(table.companyId),
    check("opening_hours_weekday_check", sql`${table.weekday} between 0 and 6`),
    check(
      "opening_hours_range_check",
      sql`${table.opensAt} < ${table.closesAt}`,
    ),
  ],
);

export const companyServiceTypes = pgTable(
  "company_service_types",
  {
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    type: serviceType("type").notNull(),
  },
  (table) => [primaryKey({ columns: [table.companyId, table.type] })],
);

export const contactChannels = pgTable(
  "contact_channels",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    type: contactType("type").notNull(),
    value: text("value").notNull(),
  },
  (table) => [index("contact_channels_company_id_idx").on(table.companyId)],
);

export const socialLinks = pgTable(
  "social_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    platform: socialPlatform("platform").notNull(),
    url: text("url").notNull(),
  },
  (table) => [index("social_links_company_id_idx").on(table.companyId)],
);

// Fotos da empresa. O arquivo fica no disco (I1-A); aqui fica só o nome.
// A primeira (menor position) é a capa (P10).
export const companyImages = pgTable(
  "company_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    companyId: uuid("company_id")
      .notNull()
      .references(() => companies.id, { onDelete: "cascade" }),
    fileName: text("file_name").notNull(),
    caption: text("caption"),
    position: smallint("position").notNull(),
  },
  (table) => [index("company_images_company_id_idx").on(table.companyId)],
);
