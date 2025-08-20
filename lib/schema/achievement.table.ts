import { date, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { achievementType } from "./achievement.schema";

export const achievementTypeEnum = pgEnum("achievement_type", [
  achievementType.수상,
  achievementType.자격증,
  achievementType.교육,
  achievementType.기타,
]);

export const achievements = pgTable("achievements", {
  _id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  date: date().notNull(),
  type: achievementTypeEnum(),
  description: text(),
});
