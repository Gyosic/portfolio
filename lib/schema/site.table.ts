import { relations } from "drizzle-orm";
import { char, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { contracts } from "./contract.table";
import { devices } from "./device.table";
import { siteServiceType } from "./site.schema";

// drizzle table 정의
export const siteServiceTypeEnum = pgEnum("site_service_type", [
  siteServiceType.MOBILE,
  siteServiceType.FACILITY,
  siteServiceType.WATERGRID,
]);
export const sites = pgTable("sites", {
  _id: char({ length: 11 }).primaryKey(),
  base_url: text(),
  dev_url: text(),
  verify_url: text(),
  token: text(),
  service_type: siteServiceTypeEnum().notNull(),
  service_id: text(),
  service_label: text(),
  service_name: text(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
});
export const sitesRelations = relations(sites, ({ many }) => ({
  contracts: many(contracts),
  devices: many(devices),
}));
