"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Column, ColumnDef } from "@tanstack/table-core";
import Excel from "exceljs";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { DataTable, tableBodyData } from "@/components/shared/DataTable";
import TemplateFormItem from "@/components/shared/TemplateFormItem";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { DateFormatType, date as dateFormat, thousandComma } from "@/lib/format";
import { ContractType } from "@/lib/schema/contract.schema";
import {
  DeviceBulkFormType,
  DeviceFormType,
  deviceBulkFormSchema,
  deviceFormSchema,
  deviceIface,
  deviceIsp,
  deviceProtocol,
  deviceStatus,
} from "@/lib/schema/device.schema";
import { Model } from "@/lib/schema/model";
import { SiteType } from "@/lib/schema/site.schema";

const omitDeviceFormSchema = deviceFormSchema.omit({ site_id: true, contract_id: true });
type OmitDeviceBulkFormType = z.infer<typeof omitDeviceFormSchema>;

interface DeviceBulkProps {
  sites: SiteType[];
  contracts: ContractType[];
}
export function DeviceBulk({ sites, contracts }: DeviceBulkProps) {
  const router = useRouter();
  const [excelData, setExcelData] = useState<DeviceFormType[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<DeviceBulkFormType>({
    resolver: zodResolver(deviceBulkFormSchema),
    mode: "onBlur",
  });

  const deviceBulkModel = useMemo(() => {
    return {
      contract_id: {
        name: "계약",
        type: "enum",
        enums: contracts.reduce(
          (acc, { _id, title }) => Object.assign(acc, { [title]: String(_id) }),
          {},
        ),
        numberType: true,
      },
      site_id: {
        name: "사이트",
        type: "enum",
        enums: sites.reduce(
          (acc, { _id, service_name }) => Object.assign(acc, { [service_name]: _id }),
          {},
        ),
      },
      uploadFile: {
        name: "파일 업로드",
        type: "file",
        desc: "xlsx 형식의 파일을 업로드 해주세요. 첫 번째 행은 헤더로 인식됩니다.",
        accept: [
          "application/haansoftxlsx",
          "application/excel",
          "application/vnd.ms-excel",
          "application/x-excel",
          "application/x-msexcel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ],
      },
    };
  }, [sites, contracts]);

  const deviceModel = useMemo<Record<keyof OmitDeviceBulkFormType, Model>>(() => {
    return {
      serial_no: { name: "시리얼번호", type: "text" },
      lte_version: { name: "LTE 버전", type: "number" },
      fw_version: { name: "펌웨어 버전", type: "number" },
      installed_at: { name: "설치일", type: "date", format: "ymd" },
      isp: { name: "통신사", type: "enum", enums: deviceIsp },
      manufacturer: { name: "제조사", type: "text" },
      iface: { name: "통신회선", type: "enum", enums: deviceIface },
      protocol: { name: "통신방식", type: "enum", enums: deviceProtocol },
      status: { name: "현황", type: "enum", enums: deviceStatus },
    };
  }, []);

  const parseExcelFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      return new Promise<DeviceFormType[]>((resolve, reject) => {
        fileReader.addEventListener("load", async (e) => {
          try {
            const data = e?.target?.result;
            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(data as ArrayBuffer);

            const worksheet = workbook.getWorksheet(1);

            if (!worksheet) return reject(new Error("워크시트를 찾을 수 없습니다."));

            const headers: string[] = [];
            const rows: string[][] = [];
            worksheet.eachRow((row, rowNumber) => {
              if (rowNumber === 1) {
                row.eachCell(({ text }, colNumber) => (headers[colNumber] = text));
              } else if (rowNumber > 1) {
                const device = [] as string[];
                row.eachCell(({ text }, colNumber) => (device[colNumber] = text));

                rows.push(device);
              }
            });

            if (rows.length < 2)
              return reject(
                new Error("데이터가 없습니다. 최소 헤더와 1개 이상의 데이터 행이 필요합니다."),
              );

            const deviceData = rows.map((row) => {
              const device: Partial<DeviceFormType> = {};

              headers.forEach((header, colIndex) => {
                const [key, { type, format, enums = {} } = {}] =
                  Object.entries(deviceModel).find(([, { name }]) => name === header) ?? [];

                const value = row[colIndex];

                if (key && value != null) {
                  if (type === "number") Object.assign(device, { [key]: Number(value) });
                  else if (type === "date")
                    Object.assign(device, {
                      [key]: dateFormat(new Date(value), { type: format as DateFormatType }),
                    });
                  else if (type === "enum") {
                    if (Object.keys(enums).includes(value as string))
                      Object.assign(device, { [key]: enums[value] });
                    else if (Object.values(enums).includes(value as string))
                      Object.assign(device, { [key]: value });
                  } else if (["text", "string"].includes(type as string))
                    Object.assign(device, { [key]: String(value) });
                }
              });

              return device;
            });

            return resolve(deviceData as DeviceFormType[]);
          } catch (error) {
            return reject(error);
          }
        });

        fileReader.addEventListener("error", () => {
          reject(new Error("파일 읽기에 실패했습니다."));
        });
      });
    } catch (error) {
      toast.error("Excel 파일 파싱 실패", {
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
      return [];
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadExcelForm = async () => {
    const headers = Object.values(deviceModel).map(({ name }) => name);
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet("sheet1");

    worksheet.addRow(headers);

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell, colNumber) => {
      if ([1, 2, 3].includes(colNumber)) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FEFD48" },
        };
      }
    });

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `입력양식_${dateFormat(new Date(), { type: "full" })}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("엑셀 파일 다운로드 실패:", error);
    }
  };

  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (data) => {
    if (excelData.length === 0) {
      toast.error("업로드된 데이터가 없습니다.");
      return;
    }

    try {
      setIsProcessing(true);

      const devices = excelData.map((device) => ({
        ...device,
        contract_id: data.contract_id,
        site_id: data.site_id,
      }));

      const response = await fetch("/api/devices/batch", {
        method: "POST",
        body: JSON.stringify({ devices }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const { error: { message = "" } = {} } = await response.json();
        throw new Error(message || "일괄 등록에 실패했습니다.");
      }

      toast.success("단말기 일괄 등록 완료", {
        description: `${excelData.length}개의 단말기가 등록되었습니다.`,
      });

      form.reset();
      setExcelData([]);
      router.push("/device");
    } catch (error) {
      toast.error("일괄 등록 실패", {
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      });
    } finally {
      setIsProcessing(false);
    }
  });

  const columns: ColumnDef<OmitDeviceBulkFormType>[] = [
    {
      accessorKey: "no",
      header: () => <div className="text-center">No.</div>,
      cell: (info) => {
        return (
          <div className="text-center">
            {info.table.getState().pagination.pageIndex *
              info.table.getState().pagination.pageSize +
              info.row.index +
              1}
          </div>
        );
      },
    },
    ...Object.entries(deviceModel ?? {}).map(([key, model]) => {
      return {
        accessorKey: `${key}`,
        header: ({ column }: { column: Column<OmitDeviceBulkFormType> }) => {
          const sortBtn = () => {
            if (column.getIsSorted() === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
            else if (column.getIsSorted() === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
          };

          return (
            <div className="text-center">
              <Button
                variant="ghost"
                type="button"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {model.name}
                {sortBtn()}
              </Button>
            </div>
          );
        },
        cell: ({ getValue }) => {
          return <div className="flex justify-center">{tableBodyData(getValue(), model)}</div>;
        },
      } as ColumnDef<Omit<DeviceFormType, "site_id" | "contract_id">>;
    }),
  ];

  useEffect(() => {
    const file = form.getValues("uploadFile");

    if (file && file instanceof File) {
      parseExcelFile(file)
        .then(setExcelData)
        .catch((err) => toast.error("Excel 파일 파싱 실패", { description: err?.message ?? "" }));
    } else setExcelData([]);
  }, [form.watch("uploadFile")]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="">
        <div className="mt-2 flex w-full flex-col gap-2">
          <Button type="button" variant="outline" onClick={() => downloadExcelForm()}>
            양식 다운로드
          </Button>
          {Object.entries(deviceBulkModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof DeviceBulkFormType}
                render={({ field }) => <TemplateFormItem fieldModel={model} field={field} />}
              />
            );
          })}

          {excelData.length > 0 && (
            <div className="flex h-full w-full flex-col gap-1">
              <div>
                <span className="text-xs">{`총 ${thousandComma(excelData.length)} 건`}</span>
              </div>
              <DataTable
                data={excelData}
                rowCount={excelData.length}
                columns={columns}
                rowSelection={{}}
                pagination={{ pageSize: 5, pageIndex: 0 }}
                sorting={[]}
              ></DataTable>
            </div>
          )}

          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              type="button"
              className="flex-1"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isProcessing || excelData.length === 0}
            >
              {isProcessing ? "처리중..." : "등록"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
