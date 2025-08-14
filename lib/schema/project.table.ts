import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  _id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  tags: text(),
  link: text(),
  role: text(),
  start: date(),
  end: date(),
});
