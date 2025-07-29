"use client";

import { useState } from "react";
import { FilterSchema, LteFilter } from "./LteFilter";
import { LteTable } from "./LteTable";

export function Lte() {
  const [filter, setFilter] = useState<FilterSchema>({});

  return (
    <section className="flex h-full flex-col">
      <LteFilter setFilter={setFilter} />
      <LteTable filter={filter}></LteTable>
    </section>
  );
}
