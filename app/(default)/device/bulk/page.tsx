import { forbidden, redirect } from "next/navigation";
import { api } from "@/config";
import { auth } from "@/lib/auth";

import * as session from "@/lib/auth/session";
import { DeviceBulk } from "./DeviceBulk";

const getSites = async () => {
  const res = await fetch(new URL("/api/sites", api.baseurl), {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  const { rows = [] } = await res.json();

  return rows;
};
const getContract = async () => {
  const res = await fetch(new URL("/api/contracts", api.baseurl), {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
  });

  const { rows = [] } = await res.json();

  return rows;
};

export default async function DeviceBulkPage() {
  const sessionContext = await auth();

  if (!session.isSys(sessionContext)) return forbidden();

  const sites = await getSites();
  const contracts = await getContract();

  return <DeviceBulk sites={sites} contracts={contracts}></DeviceBulk>;
}
