import z from "zod";
import { buildSchema } from "../zod";
import { date, enumField, text, textarea } from "./field";

export const achievementType = {
  수상: "AWARD",
  자격증: "CERTIFICATE",
  교육: "EDUCATION",
  기타: "OTHER",
} as const;

export const achievementModel = {
  title: text({ name: "활동명", required: true }),
  type: enumField({ name: "유형", enums: achievementType, required: true }),
  date: date({ name: "날짜", format: "ymd" }),
  description: textarea({ name: "세부사항" }),
};

export const achievementFormSchema = buildSchema(achievementModel);
export const achievementSchema = achievementFormSchema.extend({ _id: z.string() });

export type AchievementFormType = z.infer<typeof achievementFormSchema>;
export type AchievementType = z.infer<typeof achievementSchema>;
