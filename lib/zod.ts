import { EnumLike, z } from "zod";
import { Model } from "./schema/model";

type ModelErrors = {
  required?: string;
  invalid?: string;
  min?: string;
  max?: string;
  pattern?: string;
  enum?: string;
};
type ModelOptions = Omit<Model, "name" | "type"> & { errors?: ModelErrors };

const withConstraints = (base: z.ZodTypeAny, opts: ModelOptions): z.ZodTypeAny => {
  let schema: z.ZodTypeAny = base;
  const errs = opts?.errors as ModelErrors | undefined;

  // 문자열 계열
  if (schema instanceof z.ZodString) {
    let s = schema as z.ZodString;
    if (opts?.min != null) s = s.min(opts.min as number, errs?.min);
    if (opts?.max != null) s = s.max(opts.max as number, errs?.max);
    if (typeof opts?.regexp === "string") s = s.regex(new RegExp(opts.regexp), errs?.pattern);
    else if (typeof opts?.pattern === "string")
      s = s.regex(new RegExp(opts.pattern), errs?.pattern);
    schema = s;
  }

  // 숫자 계열
  if (schema instanceof z.ZodNumber) {
    let n = schema as z.ZodNumber;
    if (opts?.min != null) n = n.min(opts.min as number, errs?.min);
    if (opts?.max != null) n = n.max(opts.max as number, errs?.max);
    schema = n;
  }

  // 날짜 계열 (z.date 사용 시에만 적용)
  if (schema instanceof z.ZodDate) {
    // Date 범위 검증이 필요하면 여기에 추가
  }

  // required가 명시적으로 true가 아니면 optional 처리
  if (opts?.required !== true) {
    schema = (schema as z.ZodTypeAny).nullable().optional();
  }

  return schema;
};

export const buildSchema = <T extends Record<string, Model>>(model: T) => {
  const shape = Object.entries(model).reduce<Record<string, z.ZodTypeAny>>(
    (acc, [fieldKey, fieldModel]) => {
      let base: z.ZodTypeAny;

      switch (fieldModel.type) {
        case "enum": {
          base = z.nativeEnum(fieldModel.enums as EnumLike, {
            required_error: fieldModel.errors?.required ?? "필수 입력값 입니다.",
            invalid_type_error: fieldModel.errors?.invalid,
          });
          break;
        }
        case "number": {
          base = z.number({
            required_error: fieldModel.errors?.required ?? "필수 입력값 입니다.",
            invalid_type_error: fieldModel.errors?.invalid,
          });
          break;
        }
        case "date":
        case "text":
        case "textarea":
        default: {
          base = z.string({
            required_error: fieldModel.errors?.required ?? "필수 입력값 입니다.",
            invalid_type_error: fieldModel.errors?.invalid,
          });
        }
      }

      // 필수 문자열은 공백 불가 기본 검증 부여
      if (base instanceof z.ZodString && fieldModel.required === true && fieldModel.min == null) {
        base = base.min(1, fieldModel.errors?.required ?? "필수 입력값 입니다.");
      }

      acc[fieldKey] = withConstraints(base, fieldModel);
      return acc;
    },
    {},
  );

  return z.object(shape);
};
