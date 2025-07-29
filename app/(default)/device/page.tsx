import { cookies } from "next/headers";
import { api } from "@/config";
import { Device as DevicePage } from "./Device";

const getSites = async () => {
  const cookieStore = await cookies();
  const res = await fetch(new URL("/api/sites", api.baseurl), {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json", Cookie: cookieStore.toString() }),
  });

  const { rows = [] } = await res.json();

  return rows;
};
const getContract = async () => {
  const cookieStore = await cookies();
  const res = await fetch(new URL("/api/contracts", api.baseurl), {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json", Cookie: cookieStore.toString() }),
  });
  const { rows = [] } = await res.json();

  return rows;
};
export default async function Device() {
  const sites = await getSites();
  const contracts = await getContract();

  return <DevicePage sites={sites} contracts={contracts}></DevicePage>;
}
