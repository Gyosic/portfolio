import { relations } from "drizzle-orm";
import { bigint, char, date, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { devices } from "./device.table";
import { sites } from "./site.table";

export const contracts = pgTable("contracts", {
  _id: uuid().primaryKey().defaultRandom(),
  amount: integer(),
  date: date(),
  sub_title: text(),
  title: text(),
  delivery_deadline: date(),
  demand_agency: text(),
  price: bigint({ mode: "number" }),
  site_id: char({ length: 11 }).references(() => sites._id),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
});

export const contractsRelations = relations(contracts, ({ one, many }) => ({
  site: one(sites, {
    fields: [contracts.site_id],
    references: [sites._id],
  }),
  devices: many(devices),
}));
