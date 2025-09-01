import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const visits = pgTable("visits", {
  _id: uuid().primaryKey().defaultRandom(),
  ip: text(),
  user_agent: text(),
  referer: text(),
  pathname: text(),
  timestamp: timestamp().defaultNow(),
});
