import { PaginationState, SortingState } from "@tanstack/table-core";
import { Operators } from "drizzle-orm";
import z from "zod";
import { Model } from "./schema/model";

export type FilterType<TModel> = {
  field: keyof TModel;
  operator: keyof Operators;
  value: unknown;
  or?: boolean;
};

export type FilterBodyType<TModel> = {
  where?: FilterType<TModel>[];
  sort?: SortingState;
  pagination?: PaginationState;
  join?: Record<string, { where?: FilterType<TModel>[]; sort: SortingState }>;
};

const enableRangeType = ["text", "string", "date", "datetime-local", "number"];

export const getOperator = <TModel extends Record<string, Model>>({
  model,
  key,
}: {
  model: TModel;
  key: string;
}) => {
  const { type, range } = model[key] ?? {};

  if (!range) {
    if (["enum", "number"].includes(type)) return "eq";
    else if (type === "hex-enum") return "sql";
  } else {
    if (enableRangeType.includes(type)) return "between";
  }

  return "like";
};

export const getFilter = <TModel extends Record<string, Model>>({
  model,
  key,
  value,
}: {
  model: TModel;
  key: string;
  value: unknown;
}): FilterType<TModel> => {
  const { type, range } = model[key] ?? {};

  if (!range) {
    if (["enum", "number"].includes(type)) return { field: key, operator: "eq", value };
    else if (type === "hex-enum") {
      if (value === "00") return { field: key, operator: "eq", value };
      else
        return {
          field: key,
          operator: "sql",
          value: `('x' || column)::bit(8)::int & ${value} != 0`,
        };
    }
  } else {
    if (enableRangeType.includes(type)) return { field: key, operator: "between", value };
  }

  return { field: key, operator: "like", value };
};

export const getFilterSchema = <TModel extends Record<string, Model>>(
  model: TModel,
  option?: Record<string, z.ZodTypeAny>,
) => {
  const modelSchema = Object.fromEntries(
    Object.entries(model).map(([key, fieldModel]) => {
      switch (fieldModel.type) {
        case "number":
          return [key, z.number().optional()];
      }
      return [key, z.string().optional()];
    }),
  );

  if (option) {
    Object.entries(option).map(([key, value]) => {
      Object.assign(modelSchema, { [key]: value });
    });
  }

  return z.object(modelSchema);
};
