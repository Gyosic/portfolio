import { relations } from "drizzle-orm";
import { date, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { sites } from "./site.table";
import { userRoleEnums, userStatusEnums, userTypeEnums } from "./user.schema";

// drizzle table 정의
export const userTypeEnum = pgEnum("user_type", [
  userTypeEnums.MOBILE,
  userTypeEnums.FACILITY,
  userTypeEnums.WATERGRID,
  userTypeEnums.SYSTEM,
]);
export const userStatusEnum = pgEnum("user_status", [userStatusEnums.승인, userStatusEnums.미승인]);
export const userRoleEnum = pgEnum("user_role", [
  userRoleEnums.관리자,
  userRoleEnums.일반,
  userRoleEnums.파트너,
]);
export const users = pgTable("users", {
  _id: uuid().primaryKey().defaultRandom(),
  username: text().notNull().unique(),
  password: text().notNull(),
  salt: text(),
  name: text().notNull(),
  company: text().notNull(),
  type: userTypeEnum().notNull(),
  day_of_use_begin: date().notNull(),
  day_of_use_end: date().notNull(),
  status: userStatusEnum().notNull().default(userStatusEnums.미승인),
  role: userRoleEnum().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
});
export const siteUser = pgTable(
  "site_user",
  {
    site_id: text()
      .notNull()
      .references(() => sites._id),
    user_id: uuid()
      .notNull()
      .references(() => users._id),
  },
  (table) => [primaryKey({ columns: [table.site_id, table.user_id] })],
);
export const siteUserRelations = relations(siteUser, ({ one }) => ({
  site: one(sites, {
    fields: [siteUser.site_id],
    references: [sites._id],
  }),
  user: one(users, {
    fields: [siteUser.user_id],
    references: [users._id],
  }),
}));
