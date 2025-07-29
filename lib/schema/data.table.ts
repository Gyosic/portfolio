import { relations } from "drizzle-orm";
import { integer, pgTable, smallint, text, timestamp } from "drizzle-orm/pg-core";
import { devices } from "./device.table";

export const datas = pgTable("datas", {
  device_serial_no: text().references(() => devices.serial_no, { onDelete: "set null" }),
  sn: text(),
  bank: integer(),
  ver: text(),
  ltever: text(),
  model: text(),
  imei: text(),
  hum: smallint(),
  temp: smallint(),
  batt: smallint(),
  cid: text(),
  rsrp: smallint(),
  rsrq: smallint(),
  snr: smallint(),
  adr: text(),
  status: text(),
  mcc: smallint(),
  mnc: smallint(),
  tac: text(),
  meterdata: text(),
  timestamp: timestamp(),
});

export const datasRelations = relations(datas, ({ one }) => ({
  device: one(devices, {
    fields: [datas.device_serial_no],
    references: [devices.serial_no],
  }),
}));
