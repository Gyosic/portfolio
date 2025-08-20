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
import { AchievementType, achievementModel } from "@/lib/schema/achievement.schema";

interface AchievementTableProps {
  where: FilterType<typeof achievementModel>[];
  loading?: boolean;
  readonly?: boolean;
  columnVisibility?: VisibilityState;
  pagination?: PaginationState;
}

export function AchievementTable({
  where,
  loading = false,
  readonly = false,
  columnVisibility = {},
  pagination: _pagination = { pageIndex: 0, pageSize: 15 },
}: AchievementTableProps) {
  const router = useRouter();
  const [data, setData] = useState<{ rows: AchievementType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>(_pagination);
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<AchievementType>[] = [
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
    ...Object.entries(achievementModel ?? {}).map(([key, model]) => {
      return {
        id: key,
        accessorFn: (row) => _get(row, key) ?? "",
        meta: model.name,
        header: ({ column }: { column: Column<AchievementType> }) => {
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
      } as ColumnDef<AchievementType>;
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

  const getAchievements = useCallback(async () => {
    const query: FilterBodyType<typeof achievementModel> = { where };

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/achievements`, {
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
    router.push("/admin/achievement/create");
  };
  const handleUpdate = (row: Row<AchievementType>) => {
    router.push(`/admin/achievement/${row.original._id}`);
  };
  const handleDelete = async (row: Row<AchievementType>) => {
    const res = await fetch(`/api/achievements/${row.original._id}`, {
      method: "DELETE",
    });

    if (!res.ok)
      return toast.error("[활동 삭제]", {
        description: `활동 삭제에 실패했습니다. ${await res.text()}`,
        position: "top-right",
      });

    toast("[활동 삭제]", {
      description: "활동가 삭제되었습니다.",
      position: "top-right",
    });

    getAchievements();
  };

  const onRowDoubleClick = async (row: Row<AchievementType>) => {
    if (!readonly) handleUpdate(row);
  };

  useEffect(() => {
    getAchievements();
  }, [getAchievements]);

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
