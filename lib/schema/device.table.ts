import { relations } from "drizzle-orm";
import {
  char,
  date,
  geometry,
  json,
  pgEnum,
  pgTable,
  point,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { contracts } from "./contract.table";
import { datas } from "./data.table";
import { deviceIface, deviceIsp, deviceProtocol, deviceStatus } from "./device.schema";
import { sites } from "./site.table";

export const deviceIspEnum = pgEnum("device_isp", [
  deviceIsp.KT,
  deviceIsp.SKT,
  deviceIsp["LGU+"],
  deviceIsp.GLOBAL,
]);
export const deviceProtocolEnum = pgEnum("device_protocol", [
  deviceProtocol.HTTP,
  deviceProtocol.LORAWAN,
  deviceProtocol.TCP,
  deviceProtocol.UDP,
  deviceProtocol.MQTT,
  deviceProtocol["RS232/485"],
  deviceProtocol.ZWAVE,
]);
export const deviceIfaceEnum = pgEnum("device_iface", [deviceIface.NBIOT, deviceIface["CAT.M1"]]);
export const deviceStatusEnum = pgEnum("device_status", [
  deviceStatus.운영,
  deviceStatus.납품,
  deviceStatus.출고,
  deviceStatus.재고,
  deviceStatus.폐기,
  deviceStatus.수리,
]);
export const devices = pgTable("devices", {
  serial_no: text().primaryKey().notNull(),
  contract_id: uuid().references(() => contracts._id, { onDelete: "set null" }),
  site_id: char({ length: 11 }).references(() => sites._id, { onDelete: "set null" }),
  service_id: text(),
  service_device_id: text(),
  installed_at: date(),
  isp: deviceIspEnum(),
  manufacturer: text(),
  iface: deviceIfaceEnum(),
  protocol: deviceProtocolEnum(),
  fw_version: smallint().notNull(),
  lte_version: smallint().notNull(),
  geometry: geometry({ type: "point", mode: "xy", srid: 4326 }),
  maintenance: json(),
  status: deviceStatusEnum(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp(),
});

export const devicesRelations = relations(devices, ({ one, many }) => ({
  contract: one(contracts, {
    fields: [devices.contract_id],
    references: [contracts._id],
  }),
  site: one(sites, {
    fields: [devices.site_id],
    references: [sites._id],
  }),
  datas: many(datas),
}));
