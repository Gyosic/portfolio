import { z } from "zod";
import type { FieldDef } from "./schema/field";

type SchemaShape<T extends Record<string, FieldDef>> = {
  [K in keyof T]: T[K] extends FieldDef<infer S> ? S : z.ZodTypeAny;
};

export const buildSchema = <T extends Record<string, FieldDef>>(model: T) => {
  const shape = Object.fromEntries(
    Object.entries(model).map(([key, field]) => [key, field.toSchema()]),
  );

  return z.object(shape) as z.ZodObject<SchemaShape<T>>;
};
