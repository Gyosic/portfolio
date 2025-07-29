"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Column,
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/table-core";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  EllipsisVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { DataTable, tableBodyData } from "@/components/shared/DataTable";
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
import { FirmwareFormType, FirmwareType, firmwareFormSchema } from "@/lib/schema/firmware.schema";
import { Model } from "@/lib/schema/model";
import { FilterSchema } from "./FirmwareFilter";

interface FirmwareTableProps {
  filter: FilterSchema;
  loading?: boolean;
}
const firmwareFieldModel = {
  version: { name: "버전명", type: "text" },
  model: { name: "모델명", type: "text" },
  bank: { name: "뱅크", type: "number" },
  originalname: { name: "파일명", type: "text" },
  size: { name: "파일크기", type: "number", file: true },
  lastModified: { name: "파일수정일", type: "date" },
};

export function FirmwareTable({ filter, loading = false }: FirmwareTableProps) {
  const [data, setData] = useState<{ rows: FirmwareType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [selectedFirmware, setSelectedFirmware] = useState<FirmwareType>();

  const columns: ColumnDef<FirmwareType>[] = [
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
    ...Object.entries(firmwareFieldModel ?? {}).map(([key, model]) => {
      return {
        accessorKey: `${key}`,
        header: ({ column }: { column: Column<FirmwareType> }) => {
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
      } as ColumnDef<FirmwareType>;
    }),
    {
      accessorKey: "_id",
      header: () => <div className="text-center"></div>,
      cell: ({ row, getValue }) => {
        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={async () => {
                    const { url, originalname } = row.original;

                    const link = document.createElement("a");
                    link.href = `/api/firmwares/files${url}`;
                    link.download = originalname;
                    link.click();

                    link.remove();
                  }}
                >
                  <Download />
                  다운로드
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDialogMode("update");
                    setSelectedFirmware(row.original);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil />
                  변경
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch(`/api/firmwares/${getValue()}`, { method: "DELETE" });

                    toast("[펌웨어 삭제]", {
                      description: "펌웨어가 삭제되었습니다.",
                      position: "top-right",
                    });

                    getFirmwares();
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

  const getFirmwares = useCallback(async () => {
    const { searchKeyword } = filter;

    const query = { where: [] };
    if (searchKeyword) {
      Object.assign(query, {
        where: [
          ...query.where,
          { field: "filename", operator: "like", value: searchKeyword, or: true },
        ],
      });
    }

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/firmwares`, {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setData(data);
  }, [filter, sorting, pagination]);

  useEffect(() => {
    getFirmwares();
  }, [getFirmwares]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="mt-3 flex h-full flex-col gap-1">
        <div className="flex items-center justify-between px-2 text-sm">
          <div>{`총 ${thousandComma(data.rowCount)} 건`}</div>
          <Button
            variant="outline"
            onClick={() => {
              setDialogMode("create");
              setDialogOpen(true);
            }}
          >
            등록
          </Button>
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
        ></DataTable>
      </div>
      {dialogMode === "create" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>펌웨어 등록</DialogTitle>
            <DialogDescription></DialogDescription>
            <FirmwareForm
              close={() => {
                setDialogOpen(false);
                getFirmwares();
              }}
            />
          </DialogHeader>
        </DialogContent>
      )}
      {dialogMode === "update" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>펌웨어 수정</DialogTitle>
            <DialogDescription></DialogDescription>
            <FirmwareForm
              close={() => {
                setDialogOpen(false);
                getFirmwares();
              }}
              firmware={selectedFirmware!}
            />
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}
interface FirmwareFormProps {
  close?: () => void;
  firmware?: FirmwareType;
}
const firmwareUpdateFormSchema = firmwareFormSchema.partial();

export function FirmwareForm({ close, firmware }: FirmwareFormProps) {
  const schema = firmware ? firmwareUpdateFormSchema : firmwareFormSchema;
  type SchemaType = z.infer<typeof schema>;

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: firmware,
  });

  const firmwareModel = useMemo<Record<keyof FirmwareFormType, Model>>(() => {
    return {
      version: { name: "버전명", type: "text" },
      model: { name: "모델명", type: "text", desc: "수신되는 데이터와 값이 일치 해야합니다" },
      bank: { name: "뱅크", type: "number", desc: "수신되는 데이터와 값이 일치 해야합니다" },
      file: { name: "파일", type: "file" },
    };
  }, []);
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(
    async (data) => {
      let res;

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) formData.append("file", value);
        else formData.append(key, String(value));
      });

      if (firmware?.filename) {
        res = await fetch(`/api/firmwares/${firmware.filename}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch("/api/firmwares/regist", {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const { error: { message = "" } = {} } = await res.json();

        return toast.error("펌웨어 등록에 실패하였습니다.", { description: message });
      }

      form.reset();
      close?.();
    },
    (invalid) => console.info(invalid),
  );

  useEffect(() => {
    if (firmware) {
      const { filename, lastModified, mimetype, originalname, size, url } = firmware;
      form.setValue("file", { filename, lastModified, mimetype, originalname, size, url });
    }
  }, [firmware]);

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(firmwareModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof FirmwareFormType}
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
