import { personal } from "@/config";
import { I18nextPageParams } from "@/lib/i18n/config";
import { Skill } from "./Skill";

interface SkillPageProps {
  params: I18nextPageParams;
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { lng } = await params;

  return <Skill lng={lng} personal={personal} />;
}
