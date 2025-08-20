import { api } from "@/config";
import { AchievementUpdate } from "./AchievementUpdate";

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
  const { _id } = await params;

  const achievement = await getAchievement(_id);

  return <AchievementUpdate achievement={achievement} />;
}
