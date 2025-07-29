"use client";

import { useState } from "react";
import { FilterSchema, SiteFilter } from "./SiteFilter";
import { SiteTable } from "./SiteTable";

export function Site() {
  const [filter, setFilter] = useState<FilterSchema>({});

  return (
    <section className="flex h-full flex-col">
      <SiteFilter setFilter={setFilter} />
      <SiteTable filter={filter}></SiteTable>
    </section>
  );
}
