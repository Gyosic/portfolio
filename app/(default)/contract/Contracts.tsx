"use client";

import { useState } from "react";
import { ContractFilter, FilterSchema } from "./ContractFilter";
import { ContractTable } from "./ContractTable";

export function Contracts() {
  const [filter, setFilter] = useState<FilterSchema>({});
  return (
    <section className="flex h-full flex-col">
      <ContractFilter setFilter={setFilter} />
      <ContractTable filter={filter} />
    </section>
  );
}
