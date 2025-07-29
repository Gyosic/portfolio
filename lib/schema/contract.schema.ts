import z from "zod";
import { siteSchema } from "./site.schema";

export const contractFormSchema = z.object({
  amount: z
    .number({ error: "필수 입력값 입니다." })
    .max(1000000000, { message: "1000000000 이하이어야 합니다." }),
  date: z.string({ error: "필수 입력값 입니다." }),
  sub_title: z.string({ error: "필수 입력값 입니다." }).min(1, "필수 입력값 입니다."),
  title: z.string({ error: "필수 입력값 입니다." }).min(1, "필수 입력값 입니다."),
  delivery_deadline: z.string({ error: "필수 입력값 입니다." }),
  demand_agency: z.string(),
  price: z.number({ error: "필수 입력값 입니다." }),
  site_id: z.string({ error: "필수 입력값 입니다." }).min(1, "필수 입력값 입니다."),
});
export const contractSchema = contractFormSchema.extend({
  _id: z.string(),
  site: siteSchema.partial().optional(),
  created_at: z.date(),
});
export type ContractFormType = z.infer<typeof contractFormSchema>;
export type ContractType = z.infer<typeof contractSchema>;
