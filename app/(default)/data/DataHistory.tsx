"use client";

import { useState } from "react";
import { DataHistoryFilter, FilterSchema } from "./DataHistoryFilter";
import { DataHistoryTable } from "./DataHistoryTable";

export function DataHistory() {
  const [filter, setFilter] = useState<FilterSchema>({});

  return (
    <section className="flex h-full flex-col">
      <DataHistoryFilter setFilter={setFilter} />
      <DataHistoryTable filter={filter}></DataHistoryTable>
    </section>
  );
}
