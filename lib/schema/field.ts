import { z } from "zod";
import { fileSchema } from "./file.schema";
import type { Model } from "./model";

// File 타입을 위한 커스텀 스키마
const fileInstanceSchema = z.union([
  z.instanceof(File),
  fileSchema.partial().extend({
    name: z.string().optional(),
    size: z.number(),
    type: z.string(),
    lastModified: z.number(),
    path: z.string().optional(),
  }),
]);

export type FieldDef<TSchema extends z.ZodTypeAny = z.ZodTypeAny> = Model & {
  toSchema: () => TSchema;
};

// 타입 레벨에서는 base schema를 반환 (기존 buildSchema와 동일한 타입 추론 유지)
// 런타임에서는 required가 아닌 필드에 nullable().optional() 적용
type SchemaFor<T extends z.ZodTypeAny, _R extends boolean | undefined> = T;

interface BaseOpts {
  name: string;
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  regexp?: string;
  placeholder?: string;
  desc?: string;
  readOnly?: boolean;
  order?: number;
  errors?: {
    required?: string;
    invalid?: string;
    min?: string;
    max?: string;
    pattern?: string;
    email?: string;
    accept?: string;
    size?: string;
  };
  [key: string]: unknown;
}

interface EnumOpts extends BaseOpts {
  enums: Record<string, string>;
  multiple?: boolean;
}

interface FileOpts extends BaseOpts {
  accept?: string[];
  size?: number;
}

interface DateOpts extends BaseOpts {
  format?: string;
}

const applyOptional = (schema: z.ZodTypeAny, required?: boolean) =>
  required ? schema : schema.nullable().optional();

const errMsg = (msg?: string) => (msg ? { error: msg } : undefined);

const applyStringConstraints = (s: z.ZodString, opts: BaseOpts) => {
  if (opts.min != null) s = s.min(opts.min, opts.errors?.min);
  if (opts.max != null) s = s.max(opts.max, opts.errors?.max);
  if (typeof opts.regexp === "string") s = s.regex(new RegExp(opts.regexp), opts.errors?.pattern);
  else if (typeof opts.pattern === "string")
    s = s.regex(new RegExp(opts.pattern), opts.errors?.pattern);
  return s;
};

export function text<R extends boolean | undefined = undefined>(
  opts: BaseOpts & { required?: R },
): FieldDef<SchemaFor<z.ZodString, R>> {
  return {
    ...opts,
    type: "text",
    toSchema() {
      let s = z.string(errMsg(opts.errors?.required ?? "필수 입력값 입니다."));
      s = applyStringConstraints(s, opts);
      return applyOptional(s, opts.required);
    },
  } as FieldDef<SchemaFor<z.ZodString, R>>;
}

export function email<R extends boolean | undefined = undefined>(
  opts: BaseOpts & { required?: R },
): FieldDef<SchemaFor<z.ZodString, R>> {
  return {
    ...opts,
    type: "email",
    toSchema() {
      const s = z.email({ error: opts.errors?.email ?? "올바른 이메일 주소를 입력해주세요." });
      return applyOptional(s, opts.required);
    },
  } as FieldDef<SchemaFor<z.ZodString, R>>;
}

export function textarea<R extends boolean | undefined = undefined>(
  opts: BaseOpts & { required?: R },
): FieldDef<SchemaFor<z.ZodString, R>> {
  return {
    ...opts,
    type: "textarea",
    toSchema() {
      let s = z.string(errMsg(opts.errors?.required ?? "필수 입력값 입니다."));
      s = applyStringConstraints(s, opts);
      return applyOptional(s, opts.required);
    },
  } as FieldDef<SchemaFor<z.ZodString, R>>;
}

export function number<R extends boolean | undefined = undefined>(
  opts: BaseOpts & { required?: R },
): FieldDef<SchemaFor<z.ZodNumber, R>> {
  return {
    ...opts,
    type: "number",
    toSchema() {
      let n = z.number(errMsg(opts.errors?.required ?? "필수 입력값 입니다."));
      if (opts.min != null) n = n.min(opts.min, opts.errors?.min);
      if (opts.max != null) n = n.max(opts.max, opts.errors?.max);
      return applyOptional(n, opts.required);
    },
  } as FieldDef<SchemaFor<z.ZodNumber, R>>;
}

export function date<R extends boolean | undefined = undefined>(
  opts: DateOpts & { required?: R },
): FieldDef<SchemaFor<z.ZodString, R>> {
  return {
    ...opts,
    type: "date",
    toSchema() {
      const s = z.string(errMsg(opts.errors?.required ?? "필수 입력값 입니다."));
      return applyOptional(s, opts.required);
    },
  } as FieldDef<SchemaFor<z.ZodString, R>>;
}

export function enumField<
  E extends Record<string, string>,
  M extends boolean | undefined = undefined,
  R extends boolean | undefined = undefined,
>(
  opts: EnumOpts & { enums: E; multiple?: M; required?: R },
): FieldDef<SchemaFor<M extends true ? z.ZodArray<z.ZodEnum<E>> : z.ZodEnum<E>, R>> {
  return {
    ...opts,
    type: "enum",
    toSchema() {
      let base: z.ZodTypeAny = z.nativeEnum(
        opts.enums as Record<string, string | number>,
        errMsg(opts.errors?.required ?? "필수 입력값 입니다."),
      );
      if (opts.multiple) {
        base = z.array(base, errMsg(opts.errors?.required ?? "필수 입력값 입니다."));
      }
      return applyOptional(base, opts.required);
    },
  } as FieldDef<SchemaFor<M extends true ? z.ZodArray<z.ZodEnum<E>> : z.ZodEnum<E>, R>>;
}

export function file<R extends boolean | undefined = undefined>(
  opts: FileOpts & { required?: R },
): FieldDef<SchemaFor<z.ZodTypeAny, R>> {
  return {
    ...opts,
    type: "file",
    toSchema() {
      const base: z.ZodTypeAny = fileInstanceSchema
        .refine(
          (f) => {
            if (!f) return true;
            if (opts.accept && opts.accept.length > 0) {
              const fileName = f instanceof File ? f.name : (f?.originalname ?? f?.name);
              const fileExtension = fileName?.split(".").pop()?.toLowerCase();
              return opts.accept.includes(fileExtension || "");
            }
            return true;
          },
          { message: opts.errors?.accept ?? "허용되지 않는 파일 형식입니다." },
        )
        .refine(
          (f) => {
            if (!f) return true;
            if (opts.size && f.size > opts.size) return false;
            return true;
          },
          { message: opts.errors?.size ?? "파일 크기가 허용 범위를 벗어났습니다." },
        );
      return applyOptional(base, opts.required);
    },
  } as FieldDef<SchemaFor<z.ZodTypeAny, R>>;
}
