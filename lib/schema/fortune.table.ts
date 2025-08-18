import { date, pgTable, text } from "drizzle-orm/pg-core";

export const fortunes = pgTable("fortunes", {
  summary: text(),
  tell: text(),
  wealth: text(),
  studies: text(),
  business: text(),
  employment: text(),
  created_at: date().defaultNow(),
});
