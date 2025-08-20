import { date, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { historyStatus } from "./history.schema";

export const historyStatusEnum = pgEnum("history_status", [
  historyStatus.정규직,
  historyStatus.파트타임,
  historyStatus.계약직,
  historyStatus.인턴,
  historyStatus.프리랜서,
  historyStatus.자영업,
  historyStatus.임시직,
  historyStatus.시즌직,
  historyStatus.군복무,
  historyStatus.구직중,
  historyStatus.기타,
]);

export const histories = pgTable("histories", {
  _id: uuid().primaryKey().defaultRandom(),
  company: text().notNull(),
  role: text().notNull(),
  position: text().notNull(),
  department: text().notNull(),
  status: historyStatusEnum(),
  description: text(),
  start: date().notNull(),
  end: date(),
});
