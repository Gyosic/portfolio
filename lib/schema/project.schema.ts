import { date, pgTable, text, uuid } from "drizzle-orm/pg-core";
import z from "zod";

// _id: uuid().primaryKey().defaultRandom(),
export const projectFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.string().optional(),
  link: z.string().optional(),
  role: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
});
export const projectSchema = projectFormSchema.extend({ _id: z.string() });

export type ProjectFormType = z.infer<typeof projectFormSchema>;
export type ProjectType = z.infer<typeof projectSchema>;
