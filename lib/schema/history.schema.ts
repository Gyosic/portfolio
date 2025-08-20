import z from "zod";
import { buildSchema } from "../zod";
import { Model } from "./model";

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
  company: { name: "회사명", type: "text", required: true },
  role: { name: "직무", type: "text", required: true },
  position: { name: "직책", type: "text", required: true },
  department: { name: "부서", type: "text", required: true },
  status: { name: "재직형태", type: "enum", enums: historyStatus, required: true },
  description: { name: "설명", type: "textarea" },
  start: { name: "시작(입사)일", type: "date", required: true },
  end: { name: "종료(퇴사)일", type: "date" },
} as const satisfies Record<string, Model>;

export const historyFormSchema = buildSchema(historyModel);

export const historySchema = historyFormSchema.extend({ _id: z.string() });

export type HistoryFormType = z.infer<typeof historyFormSchema>;
export type HistoryType = z.infer<typeof historySchema>;
