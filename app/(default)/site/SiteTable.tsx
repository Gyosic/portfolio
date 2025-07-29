"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Column,
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/table-core";
import { ArrowDown, ArrowUp, ArrowUpDown, EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Model } from "@/lib/schema/model";
import { SiteFormType, SiteType, siteFormSchema, siteServiceType } from "@/lib/schema/site.schema";
import { FilterSchema } from "./SiteFilter";

interface SiteTableProps {
  filter: FilterSchema;
  loading?: boolean;
}
const siteFieldModel = {
  service_name: { name: "사이트명", type: "text" },
  base_url: { name: "사이트 URL", type: "text" },
  service_type: { name: "서비스 유형", type: "enum", enums: siteServiceType },
  service_label: { name: "서비스 라벨", type: "text" },
  created_at: { name: "생성일", type: "date", format: "ymd Hms" },
};

export function SiteTable({ filter, loading = false }: SiteTableProps) {
  const [data, setData] = useState<{ rows: SiteType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [selectedSite, setSelectedSite] = useState<SiteFormType>();

  const columns: ColumnDef<SiteType>[] = [
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
    ...Object.entries(siteFieldModel ?? {}).map(([key, model]) => {
      return {
        accessorFn: (row) => row?.[key as keyof SiteType] ?? "",
        accessorKey: `${key}`,
        header: ({ column }: { column: Column<SiteType> }) => {
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
      } as ColumnDef<SiteType>;
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
                  onClick={() => {
                    setDialogMode("update");
                    setSelectedSite(row.original);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil />
                  변경
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch(`/api/sites/${getValue()}`, { method: "DELETE" });

                    toast("[사이트 삭제]", {
                      description: "사이트가 삭제되었습니다.",
                      position: "top-right",
                    });

                    getSites();
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

  const getSites = useCallback(async () => {
    const { searchKeyword } = filter;

    const query = { where: [] };
    if (searchKeyword) {
      Object.assign(query, {
        where: [
          ...query.where,
          { field: "service_name", operator: "like", value: searchKeyword, or: true },
        ],
      });
    }

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/sites`, {
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
    getSites();
  }, [getSites]);

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
            <DialogTitle>사이트 등록</DialogTitle>
            <DialogDescription></DialogDescription>
            <SiteForm
              close={() => {
                setDialogOpen(false);
                getSites();
              }}
            />
          </DialogHeader>
        </DialogContent>
      )}
      {dialogMode === "update" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>사이트 수정</DialogTitle>
            <DialogDescription></DialogDescription>
            <SiteForm
              close={() => {
                setDialogOpen(false);
                getSites();
              }}
              site={selectedSite!}
            />
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}
interface SiteFormProps {
  close?: () => void;
  site?: SiteType;
}
export function SiteForm({ close, site }: SiteFormProps) {
  const resolverSiteProps = useMemo(() => {
    return site ? siteFormSchema.partial() : siteFormSchema;
  }, [site]);
  type ResolverSiteProps = z.infer<typeof resolverSiteProps>;

  const form = useForm<ResolverSiteProps>({
    resolver: zodResolver(resolverSiteProps),
    mode: "onBlur",
    defaultValues: site,
  });
  const onBlurSetService = async () => {
    try {
      const base_url = form.getValues("base_url");
      const service_id = form.getValues("service_id");
      if (base_url && service_id) {
        const res = await fetch(new URL(`/api/services/${service_id}`, base_url));
        const { onem2mId, properties: { name, serviceLabel } = {} } = await res.json();

        form.setValue("service_label", serviceLabel);
        form.setValue("service_name", name);
        form.setValue("_id", onem2mId);
      }
    } catch {
      // IGNORE
    }
  };
  const siteModel = useMemo<Record<keyof ResolverSiteProps, Model>>(() => {
    return {
      base_url: {
        name: "사이트 URL",
        type: "string",
        onBlur: onBlurSetService,
      },
      service_id: {
        name: "서비스 ID",
        type: "string",
        onBlur: onBlurSetService,
      },
      token: { name: "토큰", type: "string" },
      dev_url: { name: "DMS 수집서버 URL", type: "string" },
      verify_url: { name: "연결 확인 URL", type: "string" },
      service_type: { name: "서비스 유형", type: "enum", enums: siteServiceType },
      _id: { name: "사이트 onem2m ID", type: "string" },
      service_label: { name: "서비스 라벨", type: "string" },
      service_name: { name: "서비스 이름", type: "string" },
    };
  }, []);
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch("/api/sites/regist", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const { error: { message = "사이트 등록에 실패하였습니다." } = {} } = await res.json();

      return toast.error(message);
    }

    form.reset();
    close?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(siteModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof ResolverSiteProps}
                render={({ field }) => (
                  <TemplateFormItem
                    fieldModel={model}
                    field={{ ...field, onBlur: model?.onBlur || ((...args: unknown[]) => {}) }}
                  />
                )}
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
