import z from "zod";
import { buildSchema } from "../zod";
import { Model } from "./model";

export const educationStatus = {
  졸업: "GRADUATED",
  재학중: "IN_PROGRESS",
  졸업예정: "EXPECTED",
  휴학: "LEAVE",
  중퇴: "DROPPED_OUT",
  수료: "COMPLETION",
  없음: "NONE",
} as const;

export const educationDegree = {
  고등학교: "HIGH_SCHOOL",
  전문학사: "ASSOCIATE",
  학사: "BACHELOR",
  석사: "MASTER",
  박사: "DOCTOR",
  없음: "NONE",
} as const;

export const educationModel = {
  degree: { name: "학위", type: "enum", enums: educationDegree },
  major: { name: "학과", type: "text" },
  status: { name: "졸업여부", type: "enum", enums: educationStatus },
  institution: { name: "학교(기관)", type: "text", required: true },
  location: { name: "소재지", type: "text" },
  start: { name: "시작(입학)일", type: "date" },
  end: { name: "종료(졸업)일", type: "date" },
  description: { name: "설명", type: "textarea" },
} as const satisfies Record<string, Model>;

export const educationFormSchema = buildSchema(educationModel);

export const educationSchema = educationFormSchema.extend({ _id: z.string() });

export type EducationFormType = z.infer<typeof educationFormSchema>;
export type EducationType = z.infer<typeof educationSchema>;
