import { json, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { uploadType } from "@/lib/schema/upload.schema";

export const uploadTypeEnum = pgEnum("upload_type", [
  uploadType.메인,
  uploadType.프로젝트,
  uploadType.취미,
]);

export const uploads = pgTable("uploads", {
  _id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  type: uploadTypeEnum().notNull(),
  file: json(),
  created_at: timestamp().defaultNow(),
});
