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
import { ContractFormType, ContractType, contractFormSchema } from "@/lib/schema/contract.schema";
import { Model } from "@/lib/schema/model";
import { FilterSchema } from "./ContractFilter";

interface ContractTableProps {
  filter: FilterSchema;
}

const contractFieldModel = {
  title: { name: "계약명", type: "text" },
  demand_agency: { name: "수요기관", type: "text" },
  amount: { name: "수량", type: "number", comma: true },
  price: { name: "가격", type: "number", comma: true },
  date: { name: "계약일", type: "text" },
  delivery_deadline: { name: "납품기한", type: "text" },
  created_at: { name: "생성일", type: "date", format: "ymd Hms" },
};

export function ContractTable({ filter }: ContractTableProps) {
  const [data, setData] = useState<{ rows: ContractType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update">("create");
  const [loading, setLoading] = useState(false);

  // 수정 시, 선택한 row 데이터
  const [selectedContract, setSelectedContract] = useState<ContractType>();

  const columns: ColumnDef<ContractType>[] = [
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
    ...Object.entries(contractFieldModel ?? {}).map(([key, model]) => {
      return {
        accessorFn: (row) => row?.[key as keyof ContractType] ?? "",
        accessorKey: `${key}`,
        header: ({ column }: { column: Column<ContractType> }) => {
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
      } as ColumnDef<ContractType>;
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
                    setSelectedContract(row.original);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch(`/api/contracts/${getValue()}`, { method: "DELETE" });

                    toast("[계약 삭제]", {
                      description: "계약정보가 삭제되었습니다.",
                      position: "top-right",
                    });

                    getContracts();
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

  const getContracts = useCallback(async () => {
    setLoading(true);
    const { searchKeyword } = filter;

    const query = { where: [] };
    if (searchKeyword) {
      Object.assign(query, {
        where: [
          ...query.where,
          { field: "title", operator: "like", value: searchKeyword, or: true },
        ],
      });
    }

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/contracts`, {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setData(data);
    setLoading(false);
  }, [filter, sorting, pagination]);

  useEffect(() => {
    getContracts();
  }, [getContracts]);

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
      <DialogContent className="max-h-10/12 overflow-auto">
        <DialogHeader>
          <DialogTitle>{dialogMode === "create" ? "계약 등록" : "계약 수정"}</DialogTitle>
          <DialogDescription />
          <ContractForm
            close={() => {
              setDialogOpen(false);
              getContracts();
            }}
            {...(dialogMode === "create" ? {} : { contract: selectedContract! })}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

/**
 *  계약관리 > 등록/수정 From
 */
interface ContractFormProps {
  close?: () => void;
  contract?: ContractType;
}

export function ContractForm({ close, contract }: ContractFormProps) {
  const [sitesData, setSitesData] = useState<{ rows: []; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });

  useEffect(() => {
    const getSitesId = async () => {
      try {
        const res = await fetch("/api/sites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data) {
          setSitesData(data);
        }
      } catch (error) {
        console.error("사이트 데이터 조회 실패:", error);
      }
    };

    getSitesId();
  }, []);

  const contractModel = useMemo<Record<keyof ContractFormType, Model>>(() => {
    const siteEnums = sitesData.rows.reduce(
      (acc, { service_name, _id }) => {
        acc[service_name] = _id;
        return acc;
      },
      {} as Record<string, string>,
    );

    return {
      title: { name: "계약명", type: "string" },
      sub_title: { name: "계약 부제목", type: "string" },
      amount: { name: "수량", type: "number" },
      price: { name: "가격", type: "number" },
      date: { name: "계약일", type: "date" },
      delivery_deadline: { name: "납기일", type: "date" },
      demand_agency: { name: "수요기관", type: "string" },
      site_id: { name: "사이트 ID", type: "enum", enums: siteEnums },
    };
  }, [sitesData]);

  const form = useForm<ContractFormType>({
    resolver: zodResolver(contractFormSchema),
    mode: "onBlur",
    defaultValues: contract
      ? contract
      : {
          amount: 0,
          price: 0,
          demand_agency: "",
          sub_title: "",
          title: "",
          site_id: "",
        },
  });
  const { handleSubmit } = form;

  const onSubmit = handleSubmit(async (data) => {
    if (contract) {
      // 수정
      try {
        const res = await fetch(`/api/contracts/${contract._id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          const { error: { message } = {} } = await res.json();
          console.error(message);
          return toast.error("계약 수정에 실패하였습니다.");
        }

        toast.success("계약이 성공적으로 수정되었습니다.");
        close?.();
      } catch (error) {
        toast.error("수정 중 오류가 발생했습니다.");
        console.error(error);
      }
    } else {
      // 등록
      try {
        const res = await fetch("/api/contracts/regist", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const { error: { message = "계약 등록에 실패하였습니다." } = {} } = await res.json();
          return toast.error(message);
        }

        toast.success("계약이 성공적으로 등록되었습니다.");
        form.reset();
        close?.();
      } catch (error) {
        toast.error("계약 등록 중 오류가 발생했습니다.");
        console.error(error);
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(contractModel).map(([key, model]) => (
            <FormField
              key={key}
              control={form.control}
              name={key as keyof ContractFormType}
              render={({ field }) => (
                <TemplateFormItem
                  fieldModel={model}
                  field={{ ...field, onBlur: model?.onBlur || (() => {}) }}
                />
              )}
            />
          ))}

          <div className="mt-4 flex gap-2">
            <Button variant="outline" type="button" className="flex-1" onClick={() => close?.()}>
              취소
            </Button>
            <Button type="submit" className="flex-1">
              {contract ? "수정" : "등록"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
