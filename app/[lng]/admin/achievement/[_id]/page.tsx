import { redirect } from "next/navigation";
import { api } from "@/config";
import { auth } from "@/lib/auth";
import { AchievementUpdate } from "./AchievementUpdate";

export const dynamic = "force-dynamic";

const getAchievement = async (_id: string) => {
  const res = await fetch(new URL("/api/achievements", api.baseurl), {
    method: "POST",
    body: JSON.stringify({ where: [{ field: "_id", operator: "eq", value: _id }] }),
  });

  if (!res.ok) return;

  const { rows = [] } = await res.json();

  return rows[0];
};

interface AchievementUpdatePageProps {
  params: Promise<{ _id: string }>;
}

export default async function AchievementUpdatePage({ params }: AchievementUpdatePageProps) {
  const sessionContext = await auth();
  if (!sessionContext) return redirect("/admin");

  const { _id } = await params;

  const achievement = await getAchievement(_id);

  return <AchievementUpdate achievement={achievement} />;
}
