"use client";

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  Table as TableCore,
} from "@tanstack/table-core";
import { Circle, LoaderCircle, X } from "lucide-react";
import { useEffect, useImperativeHandle, useMemo, useState } from "react";

import { Pagination } from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateFormatType, date, fileSize, thousandComma } from "@/lib/format";
import { type Model } from "@/lib/schema/model";
import { Switch } from "../ui/switch";

export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  rowCount: number;
  apiRef?: React.Ref<TableCore<TData>>;
  sorting?: SortingState;
  rowSelection?: RowSelectionState;
  pagination?: PaginationState;
  columnVisibility?: VisibilityState;
  loading?: boolean;
  ssrOption?: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onRowDoubleClick?: (args: Row<TData>) => void;
}

function useSSRTableOptions(enabled: boolean = true) {
  return useMemo(() => {
    return enabled ? { manualPagination: true, manualSorting: true } : {};
  }, [enabled]);
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  apiRef,
  sorting,
  pagination,
  columnVisibility: visibility = {},
  loading,
  ssrOption = true,
  rowSelection,
  onSortingChange: handleSortingChange,
  onPaginationChange: handlePaginationChange,
  onRowSelectionChange: handleRowSelectionChange,
  onRowDoubleClick,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(visibility);
  const tableOptions = useSSRTableOptions(ssrOption);

  const table = useReactTable({
    data,
    columns,
    // @ts-expect-error: TData is dynamic object
    getRowId: (row) => (row._id as string) ?? (row.id as string),
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    onPaginationChange: handlePaginationChange,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
    ...tableOptions,
    rowCount,
  });

  const rows = table.getRowModel().rows;

  useImperativeHandle(apiRef, () => table);

  return (
    <div className="space-y-2">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <LoaderCircle className="m-auto size-12 animate-spin" />
                </TableCell>
              </TableRow>
            ) : rows?.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onDoubleClick={() => onRowDoubleClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination table={table} total={rowCount} />
    </div>
  );
}

/**
 * @description
 * Table 데이터 값을 알맞는 형태로 변환한다.
 * plain 옵션을 부여하는 경우 jsx 형태의 반환값이 텍스트로 변환된다.
 *
 * @example
 * tableBodyData(100000, {type: "number"})
 * tableBodyData(100000, {type: "hex-enum", enums: {...}}, true)
 *
 * @param value unknown
 * @param options.type string
 * @param options.enums Record<string, unknown>
 * @param options.multiple boolean
 * @param plain boolean
 * @returns React.ReactNode
 */

export function tableBodyData(
  value: unknown,
  options: Omit<Model, "name">,
  plain?: boolean,
): React.ReactNode {
  const { type, enums, multiple, comma, file, format = "ymd hms", labelColorMap, refine } = options;

  if (refine && refine instanceof Function) return refine(value, plain);

  if (type === "enum") {
    if (multiple) {
      return (value as string[])
        .map((v) => {
          const [result = v] = Object.entries(enums!).find(([, e]) => v === e) || [];
          return result;
        })
        .join(",");
    } else {
      const [result = value] = Object.entries(enums!).find(([, v]) => v === value) || [];
      return result as string;
    }
  } else if (type === "number" && comma) {
    return thousandComma(value as number);
  } else if (type === "number" && file) {
    return fileSize(value as number);
  } else if (type === "hexstring") {
    const parsed = parseInt(value as string, 16);
    return isNaN(parsed) ? "" : parseInt(value as string, 16);
  } else if (["date", "datetime-local"].includes(type as string)) {
    if (value) return date(value as Date, { type: format as DateFormatType });
  } else if (type === "boolean") {
    return plain ? !!value ? true : false : !!value ? <Circle /> : <X />;
  } else if (type === "switch") {
    return plain ? !!value ? true : false : <Switch defaultChecked={value as boolean} />;
  } else if (type === "hex-enum") {
    let resultArr = Object.entries(enums || {}).reduce((acc, [label, bit]) => {
      const hex = parseInt(value as string, 16);
      if (hex & (bit as number)) acc.push(label);
      return acc;
    }, [] as string[]);

    if (resultArr.length === 0) {
      const [label] = Object.entries(enums || {}).find(([, bit]) => bit === value) || [];
      if (label) resultArr = [label as string];
    }

    return plain ? (
      resultArr.map((label) => label).join(", ")
    ) : (
      <div className="flex gap-1">
        {resultArr.map((label) => (
          <Badge
            key={label}
            variant="secondary"
            style={{
              backgroundColor: (labelColorMap as Record<string, string>)?.[label] || "#e5e7eb", // 기본 gray
              color: "#fff",
            }}
          >
            {label}
          </Badge>
        ))}
      </div>
    );
  } else return (value as string) ?? "";
}
