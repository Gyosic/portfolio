/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> **/
import {
  and,
  Column,
  ColumnDataType,
  asc as drizzleOrmAsc,
  desc as drizzleOrmDesc,
  eq,
  gt,
  gte,
  ilike,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  Operators,
  or,
  SQL,
  SQLWrapper,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  PgColumn,
  PgSelectQueryBuilder,
  PgTableWithColumns,
  TableConfig,
} from "drizzle-orm/pg-core";
import { Pool } from "pg";
import { postgresql } from "@/config";

export const pool = new Pool(postgresql);

export const db = drizzle({ client: pool });

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const operators = (col: Column, operator: keyof Operators, value: ColumnDataType) => {
  switch (operator) {
    case "eq":
      return eq(col, value);
    case "ne":
      return ne(col, value);
    case "gt":
      return gt(col, value);
    case "gte":
      return gte(col, value);
    case "lt":
      return lt(col, value);
    case "lte":
      return lte(col, value);
    case "like":
      return like(col, `%${value}%`);
    case "ilike":
      return ilike(col, `%${value}%`);
    case "isNull":
      return isNull(col);
    case "isNotNull":
      return isNotNull(col);
    case "between":
      if (!Array.isArray(value) || value.length !== 2) {
        throw new Error(
          `Invalid value for 'between' operator: ${value}는 두 개의 값을 포함해야 합니다.`,
        );
      }
      return and(gte(col, value[0]), lte(col, value[1]));
    case "notBetween":
      if (!Array.isArray(value) || value.length !== 2) {
        throw new Error(
          `Invalid value for 'notBetween' operator: ${value}는 두 개의 값을 포함해야 합니다.`,
        );
      }
      return or(lt(col, value[0]), gt(col, value[1]));
    default:
      throw new Error(`Invalid operator: ${operator}는 지원되지 않는 연산자입니다.`);
  }
};

type FilterType<T> = {
  field: keyof T;
  operator: keyof Operators;
  value: ColumnDataType;
  or?: boolean;
};

interface QueryParams<T> {
  where?: FilterType<T>[];
  sort?: { id: keyof T; desc: boolean }[];
  pagination?: { pageIndex: number; pageSize: number };
}

export const selectQuerying = <
  Q extends PgSelectQueryBuilder,
  T extends Record<string, PgColumn<any>>,
  P extends TableConfig,
>(
  query: Q,
  table: PgTableWithColumns<P>,
  params: QueryParams<T>,
) => {
  let chainning = query;

  let whereCondition: SQL<unknown> | undefined;
  let orderCondition: SQL<unknown>[] = [];

  if (params.where && params.where.length > 0) {
    const { or: orConditions, conditions } = params.where.reduce(
      (acc, { or = false, ...filter }) => {
        const col = table[filter.field as string];

        if (!col)
          throw new Error(`Invalid field: ${String(filter.field)}는 테이블에 존재하지 않습니다.`);

        if (or) acc.or.push(operators(col, filter.operator, filter.value));
        else acc.conditions.push(operators(col, filter.operator, filter.value));

        return acc;
      },
      { or: [] as (SQLWrapper | undefined)[], conditions: [] as (SQLWrapper | undefined)[] },
    );

    whereCondition = and(...conditions, or(...orConditions));

    chainning = chainning.where(whereCondition);
  }

  if (params?.sort && params.sort.length > 0) {
    const conditions = params.sort.map(({ id, desc }) => {
      const col = table[id as string];

      if (!col) throw new Error(`Invalid field: ${String(id)}는 테이블에 존재하지 않습니다.`);

      if (desc) return drizzleOrmDesc(col);
      else return drizzleOrmAsc(col);
    });

    orderCondition = conditions;

    chainning = chainning.orderBy(...conditions);
  }

  if (params?.pagination) {
    const { pageSize, pageIndex } = params.pagination;
    chainning = chainning.limit(pageSize).offset(pageIndex * pageSize);
  }

  return { whereCondition, orderCondition, query: chainning };
};
