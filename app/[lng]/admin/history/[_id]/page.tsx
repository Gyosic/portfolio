import { api } from "@/config";
import HistoryUpdate from "./HistoryUpdate";

const getHistory = async (_id: string) => {
  const res = await fetch(new URL("/api/histories", api.baseurl), {
    method: "POST",
    body: JSON.stringify({ where: [{ field: "_id", operator: "eq", value: _id }] }),
  });

  if (!res.ok) return;

  const { rows = [] } = await res.json();

  return rows[0];
};

interface HistoryUpdatePageProps {
  params: Promise<{ _id: string }>;
}

export default async function HistoryUpdatePage({ params }: HistoryUpdatePageProps) {
  const { _id } = await params;

  const history = await getHistory(_id);

  return <HistoryUpdate history={history} />;
}
