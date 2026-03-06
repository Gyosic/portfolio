import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const chatLogs = pgTable("chat_logs", {
  _id: uuid().primaryKey().defaultRandom(),
  ip: text(),
  question: text().notNull(),
  lng: text().default("ko"),
  created_at: timestamp().defaultNow(),
});
