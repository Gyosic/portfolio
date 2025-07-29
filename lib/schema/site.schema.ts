import { z } from "zod";

export const siteServiceType = {
  MOBILE: "mobile",
  FACILITY: "facility",
  WATERGRID: "watergrid",
} as const;

export const siteFormSchema = z.object({
  _id: z
    .string({ error: "필수입력값 입니다" })
    .min(11, "11 자리 문자열이어야 합니다")
    .max(11, "11 자리 문자열이어야 합니다"),
  base_url: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  dev_url: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  verify_url: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  token: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  service_type: z.enum(siteServiceType, {
    error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
  }),
  service_id: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  service_label: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
  service_name: z.string({ error: "필수입력값 입니다" }).min(1, "필수입력값 입니다"),
});

export const siteSchema = siteFormSchema.extend({
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type SiteFormType = z.infer<typeof siteFormSchema>;

export type SiteType = z.infer<typeof siteSchema>;
