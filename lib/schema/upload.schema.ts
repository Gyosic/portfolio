import { z } from "zod";
import { fileSchema } from "@/lib/schema/file.schema";

export const uploadType = {
  메인: "main",
  프로젝트: "project",
  취미: "hobby",
} as const;

export const uploadFormSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(uploadType),
  file: z.instanceof(File).or(fileSchema),
});

export const uploadSchema = uploadFormSchema.extend({ _id: z.string() });

export type UploadFormType = z.infer<typeof uploadFormSchema>;
export type UploadType = z.infer<typeof uploadSchema>;
