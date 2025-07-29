"use client";

import { useState } from "react";
import { ContractType } from "@/lib/schema/contract.schema";
import { SiteType } from "@/lib/schema/site.schema";
import { DeviceFilter, FilterSchema } from "./DeviceFilter";
import { DeviceTable } from "./DeviceTable";

interface DeviceProps {
  sites: SiteType[];
  contracts: ContractType[];
}
export function Device({ sites, contracts }: DeviceProps) {
  const [filter, setFilter] = useState<FilterSchema>({});

  return (
    <section className="flex h-full flex-col">
      <DeviceFilter setFilter={setFilter} sites={sites} contracts={contracts} />
      <DeviceTable filter={filter} sites={sites} contracts={contracts}></DeviceTable>
    </section>
  );
}
