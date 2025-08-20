import { date, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { educationDegree, educationStatus } from "./education.schema";

export const educationStatusEnum = pgEnum("education_status", [
  educationStatus.졸업,
  educationStatus.재학중,
  educationStatus.졸업예정,
  educationStatus.휴학,
  educationStatus.중퇴,
  educationStatus.수료,
  educationStatus.없음,
]);

export const educationDegreeEnum = pgEnum("education_degree", [
  educationDegree.고등학교,
  educationDegree.전문학사,
  educationDegree.학사,
  educationDegree.석사,
  educationDegree.박사,
  educationDegree.없음,
]);

export const educations = pgTable("educations", {
  _id: uuid().primaryKey().defaultRandom(),
  degree: educationDegreeEnum(),
  major: text(),
  institution: text().notNull(),
  location: text(),
  start: date(),
  end: date(),
  description: text(),
  status: educationStatusEnum(),
});
