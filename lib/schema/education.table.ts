import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const educations = pgTable("educations", {
  _id: uuid().primaryKey().defaultRandom(),
  degree: text().notNull(),
  institution: text().notNull(),
  location: text(),
  start: date(),
  end: date(),
  description: text(),
});
