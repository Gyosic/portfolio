import z from "zod";
import { skills } from "../skill";
import { buildSchema } from "../zod";
import { Model } from "./model";

export const projectSkills = skills.reduce(
  (acc, { label, value }) => Object.assign(acc, { [label]: value }),
  {},
);
export const projectModel = {
  title: { name: "프로젝트명", type: "text", required: true },
  description: { name: "세부설명", type: "textarea" },
  role: { name: "직무", type: "text" },
  skills: { name: "기술", type: "enum", multiple: true, enums: projectSkills },
  link: { name: "URL", type: "text" },
  repo: { name: "Git URL", type: "text" },
  readme: {
    name: "README 파일",
    type: "file",
    accept: ["md", "txt"],
    size: 1024 * 1024, // 1MB 제한
    errors: {
      required: "README 파일을 선택해주세요.",
      accept: "Markdown(.md) 또는 텍스트(.txt) 파일만 업로드 가능합니다.",
      size: "파일 크기는 1MB 이하여야 합니다.",
    },
  },
  start: { name: "시작일", type: "date", format: "ymd" },
  end: { name: "종료일", type: "date", format: "ymd" },
} as const satisfies Record<string, Model>;

export const projectFormSchema = buildSchema(projectModel);
export const projectSchema = projectFormSchema.extend({ _id: z.string() });

export type ProjectFormType = z.infer<typeof projectFormSchema>;
export type ProjectType = z.infer<typeof projectSchema>;
