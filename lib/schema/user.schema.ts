import { z } from "zod";
import { siteSchema } from "./site.schema";

export const userStatusEnums = { 승인: "approved", 미승인: "not-approved" } as const;
export const userTypeEnums = {
  MOBILE: "mobile",
  FACILITY: "facility",
  WATERGRID: "watergrid",
  SYSTEM: "system",
} as const;
export const userRoleEnums = {
  관리자: "admin",
  일반: "normal",
  파트너: "partner",
} as const;

export const userFormSchema = z.object({
  username: z
    .string({
      error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
    })
    .min(1, "필수 입력값 입니다."),
  password: z
    .string({
      error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
    })
    .min(1, "필수 입력값 입니다."),
  confirmPassword: z
    .string({
      error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
    })
    .min(1, "필수 입력값 입니다."),
  name: z
    .string({
      error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
    })
    .min(1, "필수 입력값 입니다."),
  company: z
    .string({
      error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
    })
    .min(1, "필수 입력값 입니다."),
  type: z.enum(userTypeEnums, {
    error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
  }),
  day_of_use_begin: z
    .string({
      error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
    })
    .min(1, "필수 입력값 입니다."),
  day_of_use_end: z
    .string({
      error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
    })
    .min(1, "필수 입력값 입니다."),
  role: z.enum(userRoleEnums, {
    error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
  }),
  site_id: z.array(z.string(), {
    error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
  }),
  status: z.enum(userStatusEnums, {
    error: (issue) => (issue.input == null ? "필수 입력값 입니다." : "유효하지 않은 값입니다."),
  }),
});

export const userPasswordSchema = userFormSchema
  .pick({ password: true, confirmPassword: true })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export const refineUserFormSchema = userFormSchema.refine(
  ({ password, confirmPassword }) => password === confirmPassword,
  {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  },
);

export const userSchema = userFormSchema
  .omit({ site_id: true, password: true, confirmPassword: true })
  .extend({
    _id: z.number(),
    is_sysadmin: z.boolean().optional(),
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    sites: z.array(siteSchema.partial()).optional(),
  });

export type UserFormType = z.infer<typeof userFormSchema>;

export type RefineUserFormType = z.infer<typeof refineUserFormSchema>;

export type UserPasswordFormType = z.infer<typeof userPasswordSchema>;

export type UserType = z.infer<typeof userSchema>;
