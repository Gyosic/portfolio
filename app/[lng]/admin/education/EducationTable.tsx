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
import { EducationType, educationDegree, educationStatus } from "@/lib/schema/education.schema";
import { Model } from "@/lib/schema/model";

interface DeviceTableProps {
  where: FilterType<typeof educationFieldModel>[];
  loading?: boolean;
  readonly?: boolean;
  columnVisibility?: VisibilityState;
  pagination?: PaginationState;
}
export const educationFieldModel: Record<string, Model> = {
  degree: { name: "학위", type: "enum", enums: educationDegree },
  major: { name: "학과", type: "text" },
  institution: { name: "기관", type: "text" },
  location: { name: "위치", type: "text" },
  status: { name: "졸업여부", type: "enum", enums: educationStatus },
  start: { name: "시작일", type: "date", format: "ymd" },
  end: { name: "종료일", type: "date", format: "ymd" },
  description: { name: "설명", type: "textarea" },
};

export function EducationTable({
  where,
  loading = false,
  readonly = false,
  columnVisibility = {},
  pagination: _pagination = { pageIndex: 0, pageSize: 15 },
}: DeviceTableProps) {
  const router = useRouter();
  const [data, setData] = useState<{ rows: EducationType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>(_pagination);
  const [sorting, setSorting] = useState<SortingState>([{ id: "end", desc: true }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<EducationType>[] = [
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
    ...Object.entries(educationFieldModel ?? {}).map(([key, model]) => {
      return {
        id: key,
        accessorFn: (row) => _get(row, key) ?? "",
        meta: model.name,
        header: ({ column }: { column: Column<EducationType> }) => {
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
      } as ColumnDef<EducationType>;
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

  const getEducations = useCallback(async () => {
    const query: FilterBodyType<typeof educationFieldModel> = { where };

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/educations`, {
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
    router.push("/admin/education/create");
  };
  const handleUpdate = (row: Row<EducationType>) => {
    router.push(`/admin/education/${row.original._id}`);
  };
  const handleDelete = async (row: Row<EducationType>) => {
    const res = await fetch(`/api/educations/${row.original._id}`, {
      method: "DELETE",
    });

    if (!res.ok)
      return toast.error("[학위 삭제]", {
        description: `학위 삭제에 실패했습니다. ${await res.text()}`,
        position: "top-right",
      });

    toast("[학위 삭제]", {
      description: "학위가 삭제되었습니다.",
      position: "top-right",
    });

    getEducations();
  };

  const onRowDoubleClick = async (row: Row<EducationType>) => {
    if (!readonly) handleUpdate(row);
  };

  useEffect(() => {
    getEducations();
  }, [getEducations]);

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
