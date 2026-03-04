import { customType, json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const vector = customType<{ data: number[]; driverParam: string }>({
  dataType() {
    return "vector(384)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: unknown): number[] {
    const str = value as string;
    return str
      .slice(1, -1)
      .split(",")
      .map(Number);
  },
});

export const embeddings = pgTable("embeddings", {
  _id: uuid().primaryKey().defaultRandom(),
  content: text().notNull(),
  embedding: vector("embedding").notNull(),
  source_type: text().notNull(),
  source_id: text(),
  metadata: json(),
  created_at: timestamp().defaultNow(),
});
