import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AchievementTable } from "./AchievementTable";

export default async function AchievementPage() {
  const sessionContext = await auth();
  if (!sessionContext) return redirect("/admin");

  return (
    <div>
      <AchievementTable where={[]} />
    </div>
  );
}
