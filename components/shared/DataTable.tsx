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
import { useImperativeHandle, useState } from "react";

import { Pagination } from "@/components/shared/Pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateFormatType, date, fileSize, thousandComma } from "@/lib/format";
import { Model } from "@/lib/schema/model";

export interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  rowCount: number;
  apiRef?: React.Ref<TableCore<TData>>;
  sorting?: SortingState;
  rowSelection?: RowSelectionState;
  pagination?: PaginationState;
  loading?: boolean;
  onSortingChange?: OnChangeFn<SortingState>;
  onPaginationChange?: OnChangeFn<PaginationState>;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  onRowDoubleClick?: (args: Row<TData>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  apiRef,
  sorting,
  pagination,
  loading,
  rowSelection,
  onSortingChange: handleSortingChange,
  onPaginationChange: handlePaginationChange,
  onRowSelectionChange: handleRowSelectionChange,
  onRowDoubleClick,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
    manualPagination: true,
    manualSorting: true,
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
 *
 * @example
 * tableBodyData(100000, {type: "number"})
 *
 * @param value unknown
 * @param options.type string
 * @param options.enums Record<string, unknown>
 * @param options.multiple boolean
 * @returns string | number
 */

export function tableBodyData(value: unknown, options: Omit<Model, "name">): React.ReactNode {
  const { type, enums, multiple, comma, file, format = "ymd hms" } = options;
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
    return parseInt(value as string, 16);
  } else if (type === "date") {
    if (value) return date(value as Date, { type: format as DateFormatType });
  } else if (type === "boolean") {
    return !!value ? <Circle /> : <X />;
  } else if (type === "hex-enum") {
    let result = Object.entries(enums || {})
      .reduce((acc, [label, bit]) => {
        const hex = parseInt(value as string, 16);
        if (hex & (bit as number)) acc.push(label);

        return acc;
      }, [] as string[])
      .join(", ");
    if (!result) {
      const [label] = Object.entries(enums || {}).find(([, bit]) => bit === value) || [];
      result = label as string;
    }
    return result;
  } else return value as string;
}
