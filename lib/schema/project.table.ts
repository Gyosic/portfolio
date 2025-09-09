import { date, json, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  _id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  skills: text().array(),
  link: text(),
  repo: text(),
  readme: json(), // 파일 메타데이터만 저장
  role: text(),
  start: date(),
  end: date(),
});
