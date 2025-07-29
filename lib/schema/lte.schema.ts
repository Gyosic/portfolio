import { z } from "zod";
import FileType from "@/lib/schema/file";

export const lteFormSchema = z.object({
  version: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  model: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  file: z.file().or(FileType),
});

export const lteFormServerSchema = z.object({
  version: z.coerce.string().min(1, "필수입력값 입니다"),
  model: z.coerce.string().min(1, "필수입력값 입니다"),
  file: z.file().or(FileType),
});

export const lteSchema = lteFormSchema.extend({
  _id: z.number(),
  originalname: z.string(),
  filename: z.string(),
  lastModified: z.number(),
  mimetype: z.string(),
  size: z.number(),
  url: z.string(),
});

export type LteFormType = z.infer<typeof lteFormSchema>;

export type LteType = z.infer<typeof lteSchema>;
