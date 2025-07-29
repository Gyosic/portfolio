"use client";

import {
  Column,
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/table-core";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DataTable, tableBodyData } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { thousandComma } from "@/lib/format";
import { DataType, dataSchema, dataStatus } from "@/lib/schema/data.schema";
import { FilterSchema } from "./DataHistoryFilter";

interface DataHistoryTableProps {
  filter: FilterSchema;
  loading?: boolean;
}
const dataFieldModel = {
  status: { name: "상태", type: "hex-enum", enums: dataStatus },
  imei: { name: "IMEI", type: "text" },
  sn: { name: "시리얼번호", type: "text" },
  model: { name: "모델명", type: "text" },
  ver: { name: "펌웨어", type: "text" },
  bank: { name: "뱅크", type: "number" },
  ltever: { name: "통신 펌웨어 버전", type: "text" },
  temp: { name: "온도", type: "number" },
  hum: { name: "습도", type: "number" },
  batt: { name: "배터리", type: "number" },
  cid: { name: "CID", type: "hexstring" },
  mcc: { name: "국가코드", type: "number" },
  mnc: { name: "네트워크코드", type: "number" },
  tac: { name: "위치코드", type: "hexstring" },
  timestamp: { name: "시간", type: "date", format: "ymd Hms" },
};

export function DataHistoryTable({ filter, loading = false }: DataHistoryTableProps) {
  const [data, setData] = useState<{ rows: DataType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns: ColumnDef<DataType>[] = [
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
    ...Object.entries(dataFieldModel ?? {}).map(([key, model]) => {
      return {
        accessorFn: (row) => row?.[key as keyof DataType] ?? "",
        accessorKey: `${key}`,
        header: ({ column }: { column: Column<DataType> }) => {
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
      } as ColumnDef<DataType>;
    }),
  ];

  const getDatas = useCallback(async () => {
    const { searchKeyword } = filter;

    const query = { where: [] };
    if (searchKeyword) {
      Object.assign(query, {
        where: [...query.where, { field: "sn", operator: "like", value: searchKeyword, or: true }],
      });
    }

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/datas`, {
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
    getDatas();
  }, [getDatas]);

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
        rowSelection={rowSelection}
        loading={loading}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onRowSelectionChange={setRowSelection}
      ></DataTable>
    </div>
  );
}
