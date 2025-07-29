import { bigint, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const firmwares = pgTable("firmwares", {
  version: text().notNull(),
  bank: integer().notNull(),
  model: text().notNull(),
  filename: text().primaryKey().notNull(),
  originalname: text().notNull(),
  lastModified: bigint({ mode: "number" }),
  mimetype: text(),
  size: integer(),
  url: text(),
});
