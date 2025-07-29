import { z } from "zod";

export const model = z
  .object({
    name: z.string(),
    type: z.string(),
    required: z.boolean().optional(),
    unique: z.boolean().optional(),
    default: z.unknown().optional(),
    pattern: z.string().optional(),
    format: z.string().optional(),
    regexp: z.string().optional(),
    max: z.number().optional(),
    min: z.number().optional(),
    step: z.number().optional(),
    precision: z.number().optional(),
    multiple: z.boolean().optional(),
    desc: z.string().optional(),
    placeholder: z.string().optional(),
    enums: z.object({}).catchall(z.string()).optional(),
    accept: z.array(z.string()).optional(),
    unit: z.string().optional(),
    readOnly: z.boolean().optional(),
    order: z.number().optional(),
    onBlur: z.any().optional(),
  })
  .catchall(z.unknown());

export type Model = z.infer<typeof model>;
