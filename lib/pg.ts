/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> **/
import {
  and,
  between,
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
  sql,
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
import { projects } from "./schema/project.table";

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
      return between(col, value[0], value[1]);
    case "notBetween":
      if (!Array.isArray(value) || value.length !== 2) {
        throw new Error(
          `Invalid value for 'notBetween' operator: ${value}는 두 개의 값을 포함해야 합니다.`,
        );
      }
      return or(lt(col, value[0]), gt(col, value[1]));
    case "sql":
      const [head, tail] = value.split("column");
      const sqlChunks = [sql.raw(head), sql`${col}`, sql.raw(tail)];
      return sql.join(sqlChunks);
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

const tableMap: Record<string, PgTableWithColumns<any>> = {
  projects,
};

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
        let col = table[filter.field as string];
        let value: any = filter.value;

        if (!col) {
          const [tableName, fieldKey] = (filter.field as string).split(".");
          const joinTable = tableMap[tableName];
          col = joinTable?.[fieldKey];

          if (!col) throw Error("테이블을 찾을 수 없습니다.");
        }

        if (col && col.dataType === "date") {
          if (Array.isArray(value)) value = value.map((d) => new Date(d));
          else value = new Date(filter.value);
        }

        if (or) acc.or.push(operators(col, filter.operator, value));
        else acc.conditions.push(operators(col, filter.operator, value));
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

      if (!col) {
        if (id.toString().includes(".")) {
          const [jsonField, jsonPath] = id.toString().split(".");
          const jsonCol = table[jsonField as string];

          if (!jsonCol) {
            if (desc)
              return sql.raw(String(id) + " DESC NULLS LAST"); // drizzleOrmDesc(sql.raw(String(id)));
            else return sql.raw(String(id) + " ASC NULLS LAST"); // drizzleOrmAsc(sql.raw(String(id)));
          }

          // const jsonSortExpr = sql`${jsonCol}->>${sql.raw(`'${jsonPath}'`)}`;

          if (desc)
            return sql`${jsonCol}->>${sql.raw(`'${jsonPath}'`)} DESC NULLS LAST`; // drizzleOrmDesc(jsonSortExpr);
          else return sql`${jsonCol}->>${sql.raw(`'${jsonPath}'`)} ASC NULLS LAST`; // drizzleOrmAsc(jsonSortExpr);
        }
      }

      if (desc)
        return sql`${col} DESC NULLS LAST`; // drizzleOrmDesc(col);
      else return sql`${col} ASC NULLS LAST`; // drizzleOrmAsc(col);
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
