import z from "zod";

export const dataStatus = {
  "계량기 검침에러": 0x01,
  "계량기 무응답": 0x02,
  "단말기 단선": 0x04,
  "계량기 단선": 0x08,
  "습도 경고": 0x10,
  "온도 경고": 0x20,
  ADC베터리에러: 0x40,
  정상: "00",
};

export const dataSchema = z.object({
  sn: z.coerce.string(),
  bank: z.coerce.number(),
  ver: z.coerce.string(),
  ltever: z.coerce.string(),
  model: z.coerce.string(),
  imei: z.coerce.string(),
  hum: z.coerce.number(),
  temp: z.coerce.number(),
  batt: z.coerce.number(),
  cid: z.coerce.string(),
  rsrp: z.coerce.number(),
  rsrq: z.coerce.number(),
  snr: z.coerce.number(),
  adr: z.coerce.string(),
  status: z.coerce.string(),
  mcc: z.coerce.number(),
  mnc: z.coerce.number(),
  tac: z.coerce.string(),
  meterdata: z.coerce.string(),
  timestamp: z.coerce.date(),
});

export type DataType = z.infer<typeof dataSchema>;
