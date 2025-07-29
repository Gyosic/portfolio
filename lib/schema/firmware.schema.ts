import { z } from "zod";
import FileType from "@/lib/schema/file";

export const firmwareFormSchema = z.object({
  version: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  model: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  bank: z.number({ error: "필수입력값 입니다" }),
  file: z.file().or(FileType),
});

export const firmwareFormServerSchema = z.object({
  version: z.coerce.string().min(1, "필수입력값 입니다"),
  model: z.coerce.string().min(1, "필수입력값 입니다"),
  bank: z.coerce.number(),
  file: z.file().or(FileType),
});

export const firmwareSchema = firmwareFormSchema.extend({
  _id: z.number(),
  originalname: z.string(),
  filename: z.string(),
  lastModified: z.number(),
  mimetype: z.string(),
  size: z.number(),
  url: z.string(),
});

export type FirmwareFormType = z.infer<typeof firmwareFormSchema>;

export type FirmwareType = z.infer<typeof firmwareSchema>;
