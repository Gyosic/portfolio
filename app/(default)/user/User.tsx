"use client";

import { useState } from "react";
import { SiteType } from "@/lib/schema/site.schema";
import { FilterSchema, UserFilter } from "./UserFilter";
import { UserTable } from "./UserTable";

interface UserProps {
  sites: SiteType[];
}
export function User({ sites }: UserProps) {
  const [filter, setFilter] = useState<FilterSchema>({});

  return (
    <section className="flex h-full flex-col">
      <UserFilter setFilter={setFilter} />
      <UserTable filter={filter} sites={sites}></UserTable>
    </section>
  );
}
