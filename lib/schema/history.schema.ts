import z from "zod";
import { buildSchema } from "../zod";
import { date, enumField, text, textarea } from "./field";

export const historyStatus = {
  정규직: "FULL_TIME",
  파트타임: "PART_TIME",
  계약직: "CONTRACT",
  인턴: "INTERN",
  프리랜서: "FREELANCE",
  자영업: "SELF_EMPLOYED",
  임시직: "TEMPORARY",
  시즌직: "SEASONAL",
  군복무: "MILITARY",
  구직중: "UNEMPLOYED",
  기타: "OTHER",
} as const;

export const historyModel = {
  company: text({ name: "회사명", required: true }),
  role: text({ name: "직무", required: true }),
  position: text({ name: "직책", required: true }),
  department: text({ name: "부서", required: true }),
  status: enumField({ name: "고용형태", enums: historyStatus, required: true }),
  description: textarea({ name: "설명" }),
  start: date({ name: "시작(입사)일", required: true }),
  end: date({ name: "종료(퇴사)일" }),
};

export const historyFormSchema = buildSchema(historyModel);
export const historySchema = historyFormSchema.extend({ _id: z.string() });

export type HistoryFormType = z.infer<typeof historyFormSchema>;
export type HistoryType = z.infer<typeof historySchema>;
