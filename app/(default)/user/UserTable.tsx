"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Column,
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/table-core";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  EllipsisVertical,
  KeyRound,
  Pencil,
  Trash,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { DataTable, tableBodyData } from "@/components/shared/DataTable";
import TemplateFormItem from "@/components/shared/TemplateFormItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { date as dateFormat, thousandComma } from "@/lib/format";
import { Model } from "@/lib/schema/model";
import { SiteType } from "@/lib/schema/site.schema";
import {
  RefineUserFormType,
  refineUserFormSchema,
  UserFormType,
  UserPasswordFormType,
  UserType,
  userFormSchema,
  userPasswordSchema,
  userRoleEnums,
  userStatusEnums,
  userTypeEnums,
} from "@/lib/schema/user.schema";
import { FilterSchema } from "./UserFilter";

type UserUpdateFormType = Omit<UserFormType, "password" | "confirmPassword">;

interface UserTableProps {
  filter: FilterSchema;
  loading?: boolean;
  sites: SiteType[];
}
const userFieldModel = {
  name: { name: "사용자명", type: "string" },
  company: { name: "소속사명", type: "string" },
  username: { name: "아이디", type: "string" },
  day_of_use_begin: { name: "사용 시작일", type: "date", format: "ymd" },
  day_of_use_end: { name: "사용 종료일", type: "date", format: "ymd" },
  type: { name: "유형", type: "enum", enums: userTypeEnums },
  role: { name: "역할", type: "enum", enums: userRoleEnums },
  status: { name: "상태", type: "enum", enums: userStatusEnums },
};

export function UserTable({ filter, loading = false, sites }: UserTableProps) {
  const [data, setData] = useState<{ rows: UserType[]; rowCount: number }>({
    rows: [],
    rowCount: 0,
  });
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "update" | "delete" | "password">(
    "create",
  );
  const [selectedUser, setSelectedUser] = useState<UserUpdateFormType & { _id: number }>();

  const columns: ColumnDef<UserType>[] = [
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
    ...Object.entries(userFieldModel ?? {}).map(([key, model]) => {
      return {
        accessorFn: (row) => row?.[key as keyof UserType] ?? "",
        accessorKey: `${key}`,
        header: ({ column }: { column: Column<UserType> }) => {
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
      } as ColumnDef<UserType>;
    }),
    {
      accessorKey: "_id",
      header: () => <div className="text-center"></div>,
      cell: ({ row }) => {
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
                    const { sites, ...user } = row.original;
                    const site_id = sites?.map(({ _id }) => _id) as string[];
                    setSelectedUser({ ...user, site_id });
                    setDialogOpen(true);
                  }}
                >
                  <Pencil />
                  변경
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setDialogMode("password");
                    const { sites, ...user } = row.original;
                    const site_id = sites?.map(({ _id }) => _id) as string[];
                    setSelectedUser({ ...user, site_id });
                    setDialogOpen(true);
                  }}
                >
                  <KeyRound />
                  비밀번호변경
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    setDialogMode("delete");
                    setDialogOpen(true);
                    const { sites, ...user } = row.original;
                    const site_id = sites?.map(({ _id }) => _id) as string[];
                    setSelectedUser({ ...user, site_id });
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

  const getUsers = useCallback(async () => {
    const { searchKeyword } = filter;

    const query = { where: [] };
    if (searchKeyword) {
      Object.assign(query, {
        where: [
          ...query.where,
          { field: "name", operator: "ilike", value: searchKeyword, or: true },
          { field: "company", operator: "ilike", value: searchKeyword, or: true },
          { field: "username", operator: "ilike", value: searchKeyword, or: true },
        ],
      });
    }

    if (sorting) Object.assign(query, { sort: sorting });

    if (pagination) Object.assign(query, { pagination });

    const response = await fetch(`/api/users`, {
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
    getUsers();
  }, [getUsers]);

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
            <DialogTitle>사용자 등록</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <UserForm
            close={() => {
              setDialogOpen(false);
              getUsers();
            }}
            sites={sites}
          />
        </DialogContent>
      )}
      {dialogMode === "update" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>사용자 수정</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <UserUpdateForm
            close={() => {
              setDialogOpen(false);
              getUsers();
            }}
            user={selectedUser!}
            sites={sites}
          />
        </DialogContent>
      )}
      {dialogMode === "delete" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>사용자 삭제</DialogTitle>
            <DialogDescription>
              정말로 삭제하시겠습니까? 삭제가 완료되면 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
              }}
            >
              취소
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (selectedUser?._id) {
                  await fetch(`/api/users/${selectedUser?._id}`, { method: "DELETE" });

                  toast("[사용자 삭제]", {
                    description: "사용자가 삭제되었습니다.",
                    position: "top-right",
                  });
                }

                setDialogOpen(false);
                getUsers();
              }}
            >
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {dialogMode === "password" && (
        <DialogContent className="max-h-10/12 overflow-auto">
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
            <DialogDescription>변경할 비밀번호를 입력하세요</DialogDescription>
          </DialogHeader>
          <UserPasswordUpdateForm
            close={() => {
              setDialogOpen(false);
              getUsers();
            }}
            user={selectedUser!}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}

interface UserFormProps {
  close?: () => void;
  sites: SiteType[];
}
export function UserForm({ close, sites }: UserFormProps) {
  const userModel = useMemo<Record<keyof RefineUserFormType, Model>>(() => {
    return {
      name: { name: "사용자명", type: "string" },
      company: { name: "소속사명", type: "string" },
      username: { name: "아이디", type: "string" },
      password: { name: "비밀번호", type: "password" },
      confirmPassword: { name: "비밀번호 확인", type: "password" },
      day_of_use_begin: { name: "사용 시작일", type: "date", format: "ymd" },
      day_of_use_end: { name: "사용 종료일", type: "date", format: "ymd" },
      type: { name: "유형", type: "enum", enums: userTypeEnums },
      role: { name: "역할", type: "enum", enums: userRoleEnums },
      site_id: {
        name: "사이트",
        type: "enum",
        enums: sites?.reduce(
          (acc, { _id, service_name }) => Object.assign(acc, { [service_name]: _id }),
          {},
        ),
        multiple: true,
      },
      status: { name: "상태", type: "enum", enums: userStatusEnums },
    };
  }, []);
  const form = useForm<RefineUserFormType>({
    resolver: zodResolver(refineUserFormSchema),
    mode: "onBlur",
    defaultValues: {
      day_of_use_begin: dateFormat(new Date(), { type: "ymd" }),
      day_of_use_end: dateFormat(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), {
        type: "ymd",
      }),
      status: "not-approved",
    },
  });
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch("/api/users/regist", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const { error: { message = "사용자 등록에 실패하였습니다." } = {} } = await res.json();

      return toast.error(message);
    }

    form.reset();
    close?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(userModel).map(([key, model], i) => {
            return (
              <FormField
                key={i}
                control={form.control}
                name={key as keyof RefineUserFormType}
                render={({ field }) => <TemplateFormItem fieldModel={model} field={field} />}
              />
            );
          })}
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => close?.()}>
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
interface UserUpdateFormProps {
  close?: () => void;
  user: UserUpdateFormType & { _id: number };
  sites: SiteType[];
}
export function UserUpdateForm({ close, user, sites }: UserUpdateFormProps) {
  const userUpdateModel: Record<keyof UserUpdateFormType, Model> = useMemo(() => {
    return {
      name: { name: "사용자명", type: "string" },
      company: { name: "소속사명", type: "string" },
      username: { name: "아이디", type: "string" },
      day_of_use_begin: { name: "사용 시작일", type: "date", format: "ymd" },
      day_of_use_end: { name: "사용 종료일", type: "date", format: "ymd" },
      type: { name: "유형", type: "enum", enums: userTypeEnums },
      role: { name: "역할", type: "enum", enums: userRoleEnums },
      site_id: {
        name: "사이트",
        type: "enum",
        enums: sites?.reduce(
          (acc, { _id, service_name }) => Object.assign(acc, { [service_name]: _id }),
          {},
        ),
        multiple: true,
      },
      status: { name: "상태", type: "enum", enums: userStatusEnums },
    };
  }, [sites]);
  const form = useForm<UserUpdateFormType>({
    resolver: zodResolver(userFormSchema.omit({ password: true, confirmPassword: true })),
    mode: "onBlur",
    defaultValues: user,
  });
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const { error: { message = "사용자 등록에 실패하였습니다." } = {} } = await res.json();

      return toast.error(message);
    }

    form.reset();
    close?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(userUpdateModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof UserUpdateFormType}
                render={({ field }) => <TemplateFormItem fieldModel={model} field={field} />}
              />
            );
          })}
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => close?.()}>
              취소
            </Button>
            <Button type="submit" className="flex-1">
              변경
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

interface UserPasswordUpdateFormProps {
  close?: () => void;
  user: UserUpdateFormType & { _id: number };
}
export function UserPasswordUpdateForm({ close, user }: UserPasswordUpdateFormProps) {
  const userPasswordUpdateModel: Record<keyof UserPasswordFormType, Model> = useMemo(() => {
    return {
      password: { name: "비밀번호", type: "password" },
      confirmPassword: { name: "비밀번호 확인", type: "password" },
    };
  }, []);
  const form = useForm<UserPasswordFormType>({
    resolver: zodResolver(userPasswordSchema),
    mode: "onBlur",
  });
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch(`/api/users/update-password/${user._id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const { error: { message = "사용자 등록에 실패하였습니다." } = {} } = await res.json();

      return toast.error(message);
    }

    form.reset();
    close?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="mt-2 flex flex-col gap-2">
          {Object.entries(userPasswordUpdateModel).map(([key, model]) => {
            return (
              <FormField
                key={key}
                control={form.control}
                name={key as keyof UserPasswordFormType}
                render={({ field }) => <TemplateFormItem fieldModel={model} field={field} />}
              />
            );
          })}
          <div className="mt-2 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => close?.()}>
              취소
            </Button>
            <Button type="submit" className="flex-1">
              변경
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
