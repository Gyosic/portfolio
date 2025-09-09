import { EnumLike, z } from "zod";
import { fileSchema } from "./schema/file.schema";
import { Model } from "./schema/model";

// File 타입을 위한 커스텀 스키마
const fileInstanceSchema = fileSchema.partial().extend({
  name: z.string(),
  size: z.number(),
  type: z.string(),
  lastModified: z.number(),
  path: z.string().optional(), // 서버에 저장된 경로
});

type ElementType<F extends Model> = F["type"] extends "enum"
  ? F["enums"] extends EnumLike
    ? z.ZodNativeEnum<F["enums"]>
    : z.ZodString
  : F["type"] extends "number"
    ? z.ZodNumber
    : F["type"] extends "file"
      ? typeof fileInstanceSchema
      : z.ZodString;

type TypeMap<F extends Model> = F["multiple"] extends true
  ? z.ZodArray<ElementType<F>>
  : ElementType<F>;

type ShapeFromModel<T extends Record<string, Model>> = {
  [K in keyof T]: TypeMap<T[K]>;
};

type ModelErrors = {
  required?: string;
  invalid?: string;
  min?: string;
  max?: string;
  pattern?: string;
  enum?: string;
  email?: string;
};
type ModelOptions = Omit<Model, "name"> & { errors?: ModelErrors };

const withConstraints = (base: z.ZodTypeAny, opts: ModelOptions): z.ZodTypeAny => {
  let schema: z.ZodTypeAny = base;
  const errs = opts?.errors as ModelErrors | undefined;
  // 문자열 계열
  if (schema instanceof z.ZodString) {
    let s = schema as z.ZodString;
    if (opts?.min != null) s = s.min(opts.min as number, errs?.min);
    if (opts?.max != null) s = s.max(opts.max as number, errs?.max);
    if (opts.type === "email") s = s.email(errs?.email ?? "올바른 이메일 주소를 입력해주세요.");
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
        case "enum":
          base = z.nativeEnum(fieldModel.enums as EnumLike, {
            required_error: fieldModel.errors?.required ?? "필수 입력값 입니다.",
            invalid_type_error: fieldModel.errors?.invalid,
          });
          break;
        case "number":
          base = z.number({
            required_error: fieldModel.errors?.required ?? "필수 입력값 입니다.",
            invalid_type_error: fieldModel.errors?.invalid,
          });
          break;
        case "file":
          base = fileInstanceSchema
            .refine(
              (file) => {
                // 파일 확장자 검증
                if (fieldModel.accept && fieldModel.accept.length > 0) {
                  const fileName =
                    file instanceof File ? file.name : (file?.originalname ?? file?.name);
                  const fileExtension = fileName?.split(".").pop()?.toLowerCase();
                  return fieldModel.accept.includes(fileExtension || "");
                }
                return true;
              },
              {
                message: fieldModel.errors?.accept ?? "허용되지 않는 파일 형식입니다.",
              },
            )
            .refine(
              (file) => {
                // 파일 크기 검증 (바이트 단위)
                if (fieldModel.size && file && file.size > fieldModel.size) return false;

                return true;
              },
              {
                message: fieldModel.errors?.size ?? "파일 크기가 허용 범위를 벗어났습니다.",
              },
            );
          break;
        case "date":
        default:
          base = z.string({
            required_error: fieldModel.errors?.required ?? "필수 입력값 입니다.",
            invalid_type_error: fieldModel.errors?.invalid,
          });
      }

      if (fieldModel.multiple === true) {
        base = z.array(base, {
          required_error: fieldModel.errors?.required ?? "필수 입력값 입니다.",
          invalid_type_error: fieldModel.errors?.invalid,
        });
      }

      acc[fieldKey] = withConstraints(base, fieldModel);
      return acc;
    },
    {},
  );

  return z.object(shape) as z.ZodObject<ShapeFromModel<T>>;
};
