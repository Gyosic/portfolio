import { and, eq, getTableColumns } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/config";
import { db } from "@/lib/pg";
import { dataSchema } from "@/lib/schema/data.schema";
import { datas } from "@/lib/schema/data.table";
import { devices } from "@/lib/schema/device.table";
import { firmwares } from "@/lib/schema/firmware.table";
import { ltes } from "@/lib/schema/lte.table";
import { sites } from "@/lib/schema/site.table";

const dataColumns = getTableColumns(datas);

export async function GET(req: NextRequest) {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const parsed = await dataSchema.parseAsync(params);

    const values = { device_serial_no: parsed.sn, ...parsed };

    let data;
    await db.transaction(async (tx) => {
      const rows = await tx
        .select({
          base_url: sites.base_url,
          fw_version: devices.fw_version,
          lte_version: devices.lte_version,
        })
        .from(devices)
        .where(eq(devices.serial_no, values.sn))
        .leftJoin(sites, eq(devices.site_id, sites._id));
      const [{ base_url, fw_version, lte_version } = {}] = rows;

      const result = { sn: values.sn, destHost: base_url };

      if (!!values.ver && !!values.ltever) {
        const dataFwVersion = parseInt(values.ver.replace(/[^0-9]/g, ""));
        const dataLteVersion = parseInt(values.ltever.replace(/[^0-9]/g, ""));
        const versionUpdate = {};
        // 펌웨어 버전 비교
        if (!!fw_version && fw_version < dataFwVersion) {
          const rows = await db
            .select()
            .from(firmwares)
            .where(and(eq(firmwares.version, values.ver), eq(firmwares.bank, values.bank)));
          const [{ url } = {}] = rows;
          if (url) {
            Object.assign(result, { fotaHost: `${api.baseurl}/api/files${url}` });
            Object.assign(versionUpdate, { fw_version: dataFwVersion });
          }
        }

        // LTE 버전 비교
        if (!!lte_version && lte_version < dataLteVersion) {
          const rows = await db
            .select()
            .from(ltes)
            .where(and(eq(ltes.version, values.ver)));
          const [{ url } = {}] = rows;
          if (url) {
            Object.assign(result, { lteHost: `${api.baseurl}/api/files${url}` });
            Object.assign(versionUpdate, { lte_version: dataLteVersion });
          }
        }

        await db.update(devices).set(versionUpdate).where(eq(devices.serial_no, values.sn));
      }

      data = result;
      const returning = await tx.insert(datas).values(values).returning(dataColumns);

      console.info("[Data Insert Returning]: ", { returning });
    });

    if (values?.cid && values?.tac && values?.mcc && values?.mnc) {
      try {
        const googleRes = await fetch(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.GOOGLE_GEOLOCATE_KEY}`,
          {
            method: "POST",
            body: JSON.stringify({
              cellTowers: [
                {
                  cellId: parseInt(values.cid, 16),
                  locationAreaCode: parseInt(values.tac, 16),
                  mobileCountryCode: values.mcc,
                  mobileNetworkCode: values.mnc,
                },
              ],
            }),
          },
        );

        if (googleRes.ok) {
          const { location: { lng, lat } = {} } = await googleRes.json();

          await db
            .update(devices)
            .set({ geometry: { x: lng, y: lat } })
            .where(eq(devices.serial_no, values.sn));
        }
      } catch {}
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const params = await req.json();
    const parsed = await dataSchema.parseAsync(params);

    const values = { device_serial_no: parsed.sn, ...parsed };

    let data;
    await db.transaction(async (tx) => {
      const rows = await tx
        .select({
          base_url: sites.base_url,
          fw_version: devices.fw_version,
          lte_version: devices.lte_version,
        })
        .from(devices)
        .where(eq(devices.serial_no, values.sn))
        .leftJoin(sites, eq(devices.site_id, sites._id));
      const [{ base_url, fw_version, lte_version } = {}] = rows;

      const result = { sn: values.sn, destHost: base_url };

      if (!!values.ver && !!values.ltever) {
        const dataFwVersion = parseInt(values.ver.replace(/[^0-9]/g, ""));
        const dataLteVersion = parseInt(values.ltever.replace(/[^0-9]/g, ""));
        // 펌웨어 버전 비교
        if (!!fw_version && fw_version < dataFwVersion) {
          const rows = await db
            .select()
            .from(firmwares)
            .where(and(eq(firmwares.version, values.ver), eq(firmwares.bank, values.bank)));
          const [{ url }] = rows;
          if (url) Object.assign(result, { fotaHost: `${api.baseurl}/api/files${url}` });
        }

        // LTE 버전 비교
        if (!!lte_version && lte_version < dataLteVersion) {
          const rows = await db
            .select()
            .from(ltes)
            .where(and(eq(ltes.version, values.ver)));
          const [{ url }] = rows;
          if (url) Object.assign(result, { lteHost: `${api.baseurl}/api/files${url}` });
        }

        await db.update(devices).set({ fw_version: dataFwVersion, lte_version: dataLteVersion });
      }

      data = result;
      const returning = await tx.insert(datas).values(values).returning(dataColumns);

      console.info("[Data Insert Returning]: ", { returning });
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err }, { status: 500 });
  }
}
