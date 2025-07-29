"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Column,
  ColumnDef,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
} from "@tanstack/table-core";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EllipsisVertical,
  ExternalLink,
  Pencil,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Marker } from "react-map-gl/maplibre";
import { toast } from "sonner";
import z from "zod";
import { DataTable, tableBodyData } from "@/components/shared/DataTable";
import Maplibre from "@/components/shared/Maplibre";
import TemplateFormItem from "@/components/shared/TemplateFormItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormField } from "@/components/ui/form";
import { thousandComma } from "@/lib/format";
import { ContractType } from "@/lib/schema/contract.schema";
import { dataStatus } from "@/lib/schema/data.schema";
import {
  DeviceType,
  deviceFormSchema,
  deviceIface,
  deviceIsp,
  deviceProtocol,
  deviceStatus,
} from "@/lib/schema/device.schema";
import { Model } from "@/lib/schema/model";
import { SiteType } from "@/lib/schema/site.schema";
import { FilterSchema } from "./DeviceFilter";

interface DeviceTableProps {
  filter: FilterSchema;
  loading?: boolean;
  sites: SiteType[];
  contracts: ContractType[];
}
const deviceFieldModel = {
  "sites.service_name": { name: "사이트", type: "text" },
  contract_name: { name: "계약", type: "text" },
  serial_no: { name: "시리얼번호", type: "text" },
  manufacturer: { name: "제조사", type: "text" },
  protocol: { name: "프로토콜", type: "enum", enums: deviceProtocol },
  "datas.model": { name: "모델명", type: "text" },
  fw_version: { name: "펌웨어", type: "text" },
  status: { name: "현황", type: "enum", enums: deviceStatus },
  "datas.timestamp": { name: "데이터 수집 시간", type: "date", format: "ymd Hms" },
  "datas.status": { name: "상태", type: "hex-enum", enums: dataStatus },
};

export function DeviceTable({ filter, loading = false, sites, contracts }: DeviceTableProps) {
  const router = useRouter();
  const [data, setData] = useState<{ rows: DeviceType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dialog, setDialog] = useState<{ open: boolean; mode: "create" | "update" | "map" }>({
    open: false,
    mode: "create",
  });
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>();
  const [location, setLocation] = useState({
    longitude: 127.07973932868816,
    latitude: 37.511393758396466,
  });

  const columns: ColumnDef<DeviceType>[] = [
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
    ...Object.entries(deviceFieldModel ?? {}).map(([key, model]) => {
      return {
        accessorKey: `${key}`,
        header: ({ column }: { column: Column<DeviceType> }) => {
          const sortBtn = () => {
            if (column.getIsSorted() === "asc") return <ArrowUp className="ml-2 h-4 w-4" />;
            else if (column.getIsSorted() === "desc") return <ArrowDown className="ml-2 h-4 w-4" />;
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
          };

          return (
            <div className="text-center">
              <Button
                variant="ghost"
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
      } as ColumnDef<DeviceType>;
    }),
    {
      accessorKey: "action",
      header: () => <div className="text-center"></div>,
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedDevice(row.original);
                    setDialog({ mode: "update", open: true });
                  }}
                >
                  <Pencil />
                  변경
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    const res = await fetch(`/api/devices/${row.original.serial_no}`, {
                      method: "DELETE",
                    });

                    if (!res.ok)
                      return toast.error("[단말기 삭제]", {
                        description: `단말기 삭제에 실패했습니다. ${await res.text()}`,
                        position: "top-right",
                      });

                    toast("[단말기 삭제]", {
                      description: "단말기가 삭제되었습니다.",
                      position: "top-right",
                    });

                    getDevices();
                  }}
                >
                  <Trash />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const getDevices = useCallback(async () => {
    const { searchKeyword, site_id, contract_id } = filter;

    const query = { where: [], join: {} };

    if (site_id) {
      query.where.push({ field: "site_id", operator: "eq", value: site_id } as never);
    }
    if (contract_id) {
      query.where.push({ field: "contract_id", operator: "eq", value: contract_id } as never);
    }
    if (searchKeyword) {
      Object.assign(query, {
        where: [
          ...query.where,
          { field: "serial_no", operator: "like", value: searchKeyword, or: true },
        ],
      });
    }

    if (sorting) {
      const joinSorting = sorting
        .filter(({ id }) => id.split("_").length > 1)
        .map(({ id, desc }) => {
          const [, key] = id.split("_");
          return { id: key, desc };
        });
      const sort = sorting.filter(({ id }) => id.split("_").length === 1);
      if (joinSorting.length) Object.assign(query, { join: { ...query.join, sort: joinSorting } });
      Object.assign(query, { sort });
    }

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/devices`, {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setData(data);
  }, [filter, sorting, pagination]);

  const onRowDoubleClick = async (row: Row<DeviceType>) => {
    setSelectedDevice(row.original);

    const { serial_no, geometry } = row.original;

    if (!geometry)
      return toast.error(`"${serial_no}" 단말기의 위치 정보가 존재하지 않습니다`, {
        position: "top-right",
      });

    const { x, y } = geometry;
    setLocation({ longitude: x, latitude: y });

    setDialog({ open: true, mode: "map" });
  };

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  return (
    <Dialog open={dialog.open} onOpenChange={(open) => setDialog((prev) => ({ ...prev, open }))}>
      <div className="mt-3 flex h-full flex-col gap-1">
        <div className="flex items-center justify-between px-2 text-sm">
          <div>{`총 ${thousandComma(data.rowCount)} 건`}</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">단말기 위치정보를 보려면 더블클릭 하세요.</span>
            <Button
              variant="outline"
              onClick={() => {
                router.push("/device/bulk");
              }}
            >
              <ExternalLink />
              일괄등록
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDialog({ open: true, mode: "create" });
              }}
            >
              등록
            </Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data.rows}
          rowCount={data.rowCount}
          pagination={pagination}
          sorting={sorting}
          rowSelection={rowSelection}
          loading={loading}
          onPaginationChange={setPagination}
          onSortingChange={setSorting}
          onRowSelectionChange={setRowSelection}
          onRowDoubleClick={onRowDoubleClick}
        ></DataTable>
      </div>
      {dialog.mode === "create" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>단말기 등록</DialogTitle>
            <DialogDescription></DialogDescription>
            <DeviceForm
              sites={sites}
              contracts={contracts}
              close={() => {
                setDialog((prev) => ({ ...prev, open: false }));
                getDevices();
              }}
            />
          </DialogHeader>
        </DialogContent>
      )}
      {dialog.mode === "update" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>단말기 수정</DialogTitle>
            <DialogDescription></DialogDescription>
            <DeviceForm
              sites={sites}
              contracts={contracts}
              close={() => {
                setDialog((prev) => ({ ...prev, open: false }));
                getDevices();
              }}
              device={selectedDevice!}
            />
          </DialogHeader>
        </DialogContent>
      )}
      {dialog.mode === "map" && (
        <DialogContent className="flex h-[40vw] w-[80vw] min-w-[80vw] max-w-[80vw] flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>단말기 위치</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <Maplibre className="h-full w-full" {...location}>
            <Marker {...location} anchor="bottom">
              <div className="relative h-6 w-6">
                <div
                  className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-8 w-8 animate-pulseWave rounded-full bg-blue-400 opacity-60"
                  style={{ animationDelay: "0s" }}
                ></div>
                <div
                  className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-8 w-8 animate-pulseWave rounded-full bg-blue-400 opacity-60"
                  style={{ animationDelay: "0.7s" }}
                ></div>
                <div
                  className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-8 w-8 animate-pulseWave rounded-full bg-blue-400 opacity-60"
                  style={{ animationDelay: "1.4s" }}
                ></div>

                <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 text-red-600 text-xl">
                  📍
                </div>
              </div>
            </Marker>
          </Maplibre>
          <div className="flex gap-2 text-xs">
            <span>{`시리얼 번호: ${selectedDevice?.serial_no}`}</span>
            <span>{`위도: ${location.longitude}`}</span>
            <span>{`경도: ${location.latitude}`}</span>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
interface DeviceFormProps {
  close?: () => void;
  device?: DeviceType;
  sites: SiteType[];
  contracts: ContractType[];
}
export function DeviceForm({ close, device, sites, contracts }: DeviceFormProps) {
  const resolverDeviceProps = useMemo(() => {
    return device ? deviceFormSchema.partial() : deviceFormSchema;
  }, [device]);
  type ResolverDeviceProps = z.infer<typeof resolverDeviceProps>;

  const form = useForm<ResolverDeviceProps>({
    resolver: zodResolver(resolverDeviceProps),
    mode: "onBlur",
    defaultValues: { status: "stock", ...device },
  });

  const deviceModel = useMemo<Record<keyof ResolverDeviceProps, Model>>(() => {
    return {
      serial_no: { name: "시리얼번호", type: "text" },
      lte_version: { name: "LTE 버전", type: "number" },
      fw_version: { name: "펌웨어 버전", type: "number" },
      contract_id: {
        name: "계약",
        type: "enum",
        enums: contracts.reduce((acc, { _id, title }) => Object.assign(acc, { [title]: _id }), {}),
      },
      site_id: {
        name: "사이트",
        type: "enum",
        enums: sites.reduce(
          (acc, { _id, service_name }) => Object.assign(acc, { [service_name]: _id }),
          {},
        ),
      },
      installed_at: { name: "설치일", type: "date", format: "ymd" },
      isp: { name: "통신사", type: "enum", enums: deviceIsp },
      manufacturer: { name: "제조사", type: "text" },
      iface: { name: "통신회선", type: "enum", enums: deviceIface },
      protocol: { name: "통신방식", type: "enum", enums: deviceProtocol },
      status: { name: "현황", type: "enum", enums: deviceStatus },
    };
  }, [sites, contracts]);
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (data) => {
    let res;
    if (device?.serial_no) {
      res = await fetch(`/api/devices/${device.serial_no}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      res = await fetch("/api/devices/regist", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!res.ok) {
      const { error: { message = "" } = {} } = await res.json();

      return toast.error("단말기 등록에 실패하였습니다.", { description: message });
    }

    form.reset();
    close?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(deviceModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof ResolverDeviceProps}
                render={({ field }) => <TemplateFormItem fieldModel={model} field={field} />}
              />
            );
          })}

          <div className="mt-2 flex">
            <Button variant="outline" type="button" className="flex-1" onClick={() => close?.()}>
              취소
            </Button>
            <Button type="submit" className="flex-1">
              등록
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
