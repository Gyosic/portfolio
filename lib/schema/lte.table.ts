import { bigint, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const ltes = pgTable("ltes", {
  version: text().notNull(),
  model: text().notNull(),
  filename: text().primaryKey().notNull(),
  originalname: text().notNull(),
  lastModified: bigint("lastModified", { mode: "number" }),
  mimetype: text(),
  size: integer(),
  url: text(),
});
