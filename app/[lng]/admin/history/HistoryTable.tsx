"use client";

import {
  Column,
  ColumnDef,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/table-core";
import _get from "lodash.get";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  EllipsisVertical,
  Pencil,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable, tableBodyData } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterBodyType, FilterType } from "@/lib/filter";
import { thousandComma } from "@/lib/format";
import { HistoryType, historyModel } from "@/lib/schema/history.schema";

interface HistoryTableProps {
  where: FilterType<typeof historyModel>[];
  loading?: boolean;
  readonly?: boolean;
  columnVisibility?: VisibilityState;
  pagination?: PaginationState;
}

export function HistoryTable({
  where,
  loading = false,
  readonly = false,
  columnVisibility = {},
  pagination: _pagination = { pageIndex: 0, pageSize: 15 },
}: HistoryTableProps) {
  const router = useRouter();
  const [data, setData] = useState<{ rows: HistoryType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>(_pagination);
  const [sorting, setSorting] = useState<SortingState>([{ id: "end", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<HistoryType>[] = [
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
      enableHiding: false,
    },
    ...Object.entries(historyModel ?? {}).map(([key, model]) => {
      return {
        id: key,
        accessorFn: (row) => _get(row, key) ?? "",
        meta: model.name,
        header: ({ column }: { column: Column<HistoryType> }) => {
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
      } as ColumnDef<HistoryType>;
    }),
    {
      accessorKey: "action",
      enableHiding: false,
      header: ({ table }) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="">
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[var(--radix-dropdown-menu-trigger-width)]"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value);
                      }}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {(column.columnDef?.meta as string) ?? column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!readonly && (
                  <DropdownMenuItem onClick={() => handleUpdate(row)}>
                    <Pencil />
                    변경
                  </DropdownMenuItem>
                )}
                {!readonly && (
                  <DropdownMenuItem onClick={() => handleDelete(row)}>
                    <Trash />
                    삭제
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const getHistories = useCallback(async () => {
    const query: FilterBodyType<typeof historyModel> = { where };

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/histories`, {
      method: "POST",
      body: JSON.stringify(query),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return toast.error(await response.text());

    const data = await response.json();
    setData(data);
  }, [where, sorting, pagination]);

  const handleCreate = () => {
    router.push("/admin/history/create");
  };
  const handleUpdate = (row: Row<HistoryType>) => {
    router.push(`/admin/history/${row.original._id}`);
  };
  const handleDelete = async (row: Row<HistoryType>) => {
    const res = await fetch(`/api/histories/${row.original._id}`, {
      method: "DELETE",
    });

    if (!res.ok)
      return toast.error("[경력 삭제]", {
        description: `경력 삭제에 실패했습니다. ${await res.text()}`,
        position: "top-right",
      });

    toast("[경력 삭제]", {
      description: "경력가 삭제되었습니다.",
      position: "top-right",
    });

    getHistories();
  };

  const onRowDoubleClick = async (row: Row<HistoryType>) => {
    if (!readonly) handleUpdate(row);
  };

  useEffect(() => {
    getHistories();
  }, [getHistories]);

  return (
    <div className="mt-3 flex h-full flex-col gap-1">
      <div className="flex items-center justify-between px-2 text-sm">
        <div>{`총 ${thousandComma(data.rowCount)} 건`}</div>
        <div className="flex items-center gap-2">
          {!readonly && (
            <Button variant="outline" onClick={() => handleCreate()}>
              등록
            </Button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data.rows}
        rowCount={data.rowCount}
        pagination={pagination}
        sorting={sorting}
        columnVisibility={columnVisibility}
        rowSelection={rowSelection}
        loading={loading}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onRowSelectionChange={setRowSelection}
        onRowDoubleClick={onRowDoubleClick}
      ></DataTable>
    </div>
  );
}
