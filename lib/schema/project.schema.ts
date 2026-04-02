import z from "zod";
import { skills } from "../skill";
import { buildSchema } from "../zod";
import { date, enumField, file, text, textarea } from "./field";

export const projectSkills = skills.reduce(
  (acc, { label, value }) => Object.assign(acc, { [label]: value }),
  {},
);
export const projectModel = {
  title: text({ name: "프로젝트명", required: true }),
  description: textarea({ name: "세부설명" }),
  role: text({ name: "직무" }),
  skills: enumField({ name: "기술", multiple: true, enums: projectSkills }),
  link: text({ name: "URL" }),
  repo: text({ name: "Git URL" }),
  readme: file({
    name: "README 파일",
    accept: ["md", "txt"],
    size: 1024 * 1024,
    errors: {
      required: "README 파일을 선택해주세요.",
      accept: "Markdown(.md) 또는 텍스트(.txt) 파일만 업로드 가능합니다.",
      size: "파일 크기는 1MB 이하여야 합니다.",
    },
  }),
  start: date({ name: "시작일", format: "ymd" }),
  end: date({ name: "종료일", format: "ymd" }),
};

export const projectFormSchema = buildSchema(projectModel);
export const projectSchema = projectFormSchema.extend({ _id: z.string() });

export type ProjectFormType = z.infer<typeof projectFormSchema>;
export type ProjectType = z.infer<typeof projectSchema>;
