import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { HistoryTable } from "./HistoryTable";

export default async function HistoryPage() {
  const sessionContext = await auth();
  if (!sessionContext) return redirect("/admin");

  return (
    <div>
      <HistoryTable where={[]} />
    </div>
  );
}
