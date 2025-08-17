import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  PaginationContent,
  PaginationItem,
  Pagination as ShadcnPagination,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PaginationProps<TData> = {
  table: Table<TData>;
  total: number;
  pageList?: string[];
  linkSize?: number;
};
export function Pagination<TData>({
  table,
  total,
  pageList = ["10", "15", "20", "30", "40"],
  linkSize = 5,
}: PaginationProps<TData>) {
  const paginationLinkList = useMemo(() => {
    const pageCount = total ? Math.ceil(total / table.getState().pagination.pageSize) : 1;
    const list = Array.from({ length: pageCount })
      .fill(0)
      .map((_, index) => index + 1);

    const currentIndex = table.getState().pagination.pageIndex;

    // 페이지 리스트 시작과 끝 계산
    const halfRange = Math.floor(linkSize / 2);
    let start = Math.max(0, currentIndex - halfRange); // 최소 0부터 시작
    let end = Math.min(pageCount, currentIndex + halfRange + 1); // 최대 pageCount까지

    // 항상 linkSize개를 유지하도록 조정
    if (end - start < linkSize) {
      if (start === 0) {
        end = Math.min(linkSize, pageCount); // 시작이 0일 경우 끝을 늘림
      } else if (end === pageCount) {
        start = Math.max(0, pageCount - linkSize); // 끝이 pageCount일 경우 시작을 줄임
      }
    }

    return list.slice(start, end);
  }, [total, table.getState().pagination.pageIndex, table.getState().pagination.pageSize]);

  const handlePageListChange = (value: string) => {
    table.setPageSize(Number(value));
  };

  const pageChange = (pageIndex: number) => {
    if (pageIndex !== table.getState().pagination.pageIndex) table.setPageIndex(pageIndex);
  };

  return (
    <ShadcnPagination>
      <PaginationContent className="flex w-full justify-between">
        <Select onValueChange={handlePageListChange}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={table.getState().pagination.pageSize}></SelectValue>
          </SelectTrigger>
          <SelectContent className="w-[80px] min-w-[80px]">
            {pageList.map((item, index) => (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex">
          <div className="flex w-[100px] items-center justify-center font-medium text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft />
            </Button>
          </PaginationItem>
          {paginationLinkList.map((item, index) => {
            return (
              <PaginationItem key={index}>
                <Button
                  variant={table.getState().pagination.pageIndex + 1 === item ? "default" : "ghost"}
                  onClick={() => pageChange(item - 1)}
                >
                  {item}
                </Button>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant="ghost"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight />
            </Button>
          </PaginationItem>
        </div>
      </PaginationContent>
    </ShadcnPagination>
  );
}
