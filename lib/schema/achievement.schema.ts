import z from "zod";
import { buildSchema } from "../zod";
import { Model } from "./model";

export const achievementType = {
  수상: "AWARD",
  자격증: "CERTIFICATE",
  교육: "EDUCATION",
  기타: "OTHER",
} as const;

export const achievementModel = {
  title: { name: "활동명", type: "text", required: true },
  type: { name: "유형", type: "enum", enums: achievementType, required: true },
  date: { name: "날짜", type: "date", format: "ymd" },
  description: { name: "세부사항", type: "textarea" },
} as const satisfies Record<string, Model>;

export const achievementFormSchema = buildSchema(achievementModel);

export const achievementSchema = achievementFormSchema.extend({ _id: z.string() });

export type AchievementFormType = z.infer<typeof achievementFormSchema>;
export type AchievementType = z.infer<typeof achievementSchema>;
