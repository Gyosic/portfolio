import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const histories = pgTable("histories", {
  _id: uuid().primaryKey().defaultRandom(),
  company: text().notNull(),
  role: text().notNull(),
  position: text().notNull(),
  description: text(),
  start: date().notNull(),
  end: date(),
});
