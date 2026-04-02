import z from "zod";
import { buildSchema } from "../zod";
import { date, enumField, text, textarea } from "./field";

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
  degree: enumField({ name: "학위", enums: educationDegree }),
  major: text({ name: "학과" }),
  status: enumField({ name: "졸업여부", enums: educationStatus }),
  institution: text({ name: "학교(기관)", required: true }),
  location: text({ name: "소재지" }),
  start: date({ name: "시작(입학)일" }),
  end: date({ name: "종료(졸업)일" }),
  description: textarea({ name: "설명" }),
};

export const educationFormSchema = buildSchema(educationModel);
export const educationSchema = educationFormSchema.extend({ _id: z.string() });

export type EducationFormType = z.infer<typeof educationFormSchema>;
export type EducationType = z.infer<typeof educationSchema>;
