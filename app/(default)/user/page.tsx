import { cookies } from "next/headers";
import { api } from "@/config";
import { User } from "./User";

export default async function UserPage() {
  const cookieStore = await cookies();
  const res = await fetch(new URL("/api/sites", api.baseurl), {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json", Cookie: cookieStore.toString() }),
  });
  const { rows = [] } = await res.json();

  return <User sites={rows}></User>;
}
