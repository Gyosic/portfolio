import { api, personal } from "@/config";
import { I18nextPageParams } from "@/lib/i18n/config";
import { About } from "./About";

export const dynamic = "force-dynamic";

const getAchievements = async () => {
  try {
    const res = await fetch(new URL("/api/achievements", api.baseurl), {
      method: "POST",
      body: JSON.stringify({ sort: [{ id: "date", desc: true }] }),
    });

    if (!res.ok) return [];

    const { rows = [] } = await res.json();

    return !!rows?.length ? rows : [];
  } catch {
    return [];
  }
};

interface AboutPageProps {
  params: I18nextPageParams;
}

export default async function AboutPate({ params }: AboutPageProps) {
  const { lng } = await params;
  const achievements = await getAchievements();

  return <About lng={lng} personal={personal} achievements={achievements} />;
}
