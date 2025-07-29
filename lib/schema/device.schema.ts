import z from "zod";
import { contractSchema } from "./contract.schema";
import { siteSchema } from "./site.schema";

export const deviceIsp = {
  KT: "kt",
  SKT: "skt",
  "LGU+": "lg",
  GLOBAL: "global",
} as const;
export const deviceProtocol = {
  HTTP: "http",
  LORAWAN: "lorawan",
  TCP: "tcp",
  UDP: "udp",
  MQTT: "mqtt",
  "RS232/485": "rs232/485",
  ZWAVE: "zwave",
} as const;
export const deviceIface = {
  NBIOT: "nbiot",
  "CAT.M1": "catm1",
} as const;
export const deviceStatus = {
  운영: "running",
  납품: "delivery",
  출고: "shipment",
  재고: "stock",
  폐기: "disposal",
  수리: "repair",
} as const;

export const deviceFormSchema = z.object({
  serial_no: z.string({ error: "필수 입력값 입니다." }).min(1, "필수 입력값 입니다."),
  fw_version: z.number({ error: "필수 입력값 입니다." }),
  lte_version: z.number({ error: "필수 입력값 입니다." }),
  contract_id: z.string().nullable().optional(),
  site_id: z.string().nullable().optional(),
  installed_at: z.string().nullable().optional(),
  isp: z.enum(deviceIsp).nullable().optional(),
  manufacturer: z.string().nullable().optional(),
  iface: z.enum(deviceIface).nullable().optional(),
  protocol: z.enum(deviceProtocol).nullable().optional(),
  status: z.enum(deviceStatus).default("stock"),
});

export const deviceFormServerSchema = z.object({
  serial_no: z.coerce.string({ error: "필수 입력값 입니다." }).min(1, "필수 입력값 입니다."),
  fw_version: z.coerce.number({ error: "필수 입력값 입니다." }),
  lte_version: z.coerce.number({ error: "필수 입력값 입니다." }),
  contract_id: z.coerce.string().nullable().optional(),
  site_id: z.coerce.string().nullable().optional(),
  installed_at: z.coerce.string().nullable().optional(),
  isp: z.enum(deviceIsp).nullable().optional(),
  manufacturer: z.coerce.string().nullable().optional(),
  iface: z.enum(deviceIface).nullable().optional(),
  protocol: z.enum(deviceProtocol).nullable().optional(),
  status: z.enum(deviceStatus).default("stock"),
});

export const deviceSchema = deviceFormSchema.extend({
  site: siteSchema.partial().optional(),
  contract: contractSchema.partial().optional(),
  geometry: z.object({ x: z.number(), y: z.number() }).nullable().optional(),
  created_at: z.date(),
});

export const deviceBulkFormSchema = z.object({
  contract_id: z.string().nullable().optional(),
  site_id: z.string().nullable().optional(),
  uploadFile: z.file(),
});

export type DeviceFormType = z.infer<typeof deviceFormSchema>;
export type DeviceType = z.infer<typeof deviceSchema>;
export type DeviceBulkFormType = z.infer<typeof deviceBulkFormSchema>;
