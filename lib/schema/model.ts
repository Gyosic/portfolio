import { z } from "zod";

export const model = z
  .object({
    name: z.string(),
    type: z.string(),
    required: z.boolean().optional(),
    errors: z
      .object({
        required: z.string().optional(),
        invalid: z.string().optional(),
        min: z.string().optional(),
        max: z.string().optional(),
        pattern: z.string().optional(),
        enum: z.string().optional(),
        email: z.string().optional(),
      })
      .optional(),
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
    enums: z.record(z.string(), z.unknown()).optional(),
    accept: z.array(z.string()).optional(),
    unit: z.string().optional(),
    readOnly: z.boolean().optional(),
    order: z.number().optional(),
    onBlur: z.any().optional(),
    refine: z.any().optional(),
  })
  .catchall(z.unknown());

export type Model = z.infer<typeof model>;
