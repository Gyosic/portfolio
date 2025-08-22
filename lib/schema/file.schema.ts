import { z } from "zod";

export const fileSchema = z.object({
  filename: z.string(),
  lastModified: z.number(),
  type: z.string(),
  originalname: z.string(),
  size: z.number(),
  src: z.string(),
});

export type FileType = z.infer<typeof fileSchema>;
