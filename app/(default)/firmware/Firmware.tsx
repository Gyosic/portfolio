"use client";

import { useState } from "react";
import { FilterSchema, FirmwareFilter } from "./FirmwareFilter";
import { FirmwareTable } from "./FirmwareTable";

export function Firmware() {
  const [filter, setFilter] = useState<FilterSchema>({});

  return (
    <section className="flex h-full flex-col">
      <FirmwareFilter setFilter={setFilter} />
      <FirmwareTable filter={filter}></FirmwareTable>
    </section>
  );
}
