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
import { type ChatLog } from "@/lib/schema/chat-log.table";
import { Model } from "@/lib/schema/model";

export const chatLogModel = {
  ip: { name: "IP", type: "text" },
  question: { name: "질문", type: "text" },
  lng: { name: "언어", type: "enum", enums: { 한국어: "ko", 영어: "en" } },
  created_at: { name: "시간", type: "text" },
} as const satisfies Record<string, Model>;

interface ChatLogProps {
  loading?: boolean;
  readonly?: boolean;
  columnVisibility?: VisibilityState;
  pagination?: PaginationState;
}

export function ChatLog({
  loading = false,
  columnVisibility = {},
  pagination: _pagination = { pageIndex: 0, pageSize: 15 },
}: ChatLogProps) {
  const [data, setData] = useState<{ rows: ChatLog[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>(_pagination);
  const [sorting, setSorting] = useState<SortingState>([{ id: "end", desc: true }]);

  const columns: ColumnDef<ChatLog>[] = [
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
    ...Object.entries(chatLogModel ?? {}).map(([key, model]) => {
      return {
        id: key,
        accessorFn: (row) => _get(row, key) ?? "",
        meta: model.name,
        header: ({ column }: { column: Column<ChatLog> }) => {
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
      } as ColumnDef<ChatLog>;
    }),
  ];

  const getChatLogs = useCallback(async () => {
    // const query: FilterBodyType<typeof chatLogModel> = { where: [] };
    const query = {};

    // if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) {
      // Object.assign(query, { pagination });
      Object.assign(query, { page: pagination.pageIndex, size: pagination.pageSize });
    }

    const params = new URLSearchParams(query);

    const response = await fetch(`/api/chat-logs?${params.toString()}`);

    if (!response.ok) return toast.error(await response.text());

    const data = await response.json();

    setData(data);
  }, [sorting, pagination]);

  useEffect(() => {
    getChatLogs();
  }, [getChatLogs]);

  return (
    <div className="mt-3 flex h-full flex-col gap-1">
      <div className="flex items-center justify-between px-2 text-sm">
        <div>{`총 ${thousandComma(data.rowCount)} 건`}</div>
      </div>

      <DataTable
        columns={columns}
        data={data.rows}
        rowCount={data.rowCount}
        pagination={pagination}
        sorting={sorting}
        columnVisibility={columnVisibility}
        rowSelection={{}}
        loading={loading}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      ></DataTable>
    </div>
  );
}
