import { api } from "@/config";
import { History } from "./History";

export const dynamic = "force-dynamic";

const getHistorys = async () => {
  try {
    const res = await fetch(new URL("/api/histories", api.baseurl), {
      method: "POST",
      body: JSON.stringify({ sort: [{ id: "start", desc: true }] }),
    });

    if (!res.ok) return [];

    const { rows = [] } = await res.json();

    return !!rows?.length ? rows : [];
  } catch {
    return [];
  }
};
export default async function HistoryPage() {
  const histories = await getHistorys();

  return <History histories={histories} />;
}
