import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ChatLog } from "./ChatLog";

export default async function HistoryPage() {
  const sessionContext = await auth();
  if (!sessionContext) return redirect("/admin");

  return (
    <div>
      <ChatLog />
    </div>
  );
}
