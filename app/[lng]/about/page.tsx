import { personal } from "@/config";
import { I18nextPageParams } from "@/lib/i18n/config";
import { About } from "./About";

interface AboutPageProps {
  params: I18nextPageParams;
}

export default async function AboutPate({ params }: AboutPageProps) {
  const { lng } = await params;

  return <About lng={lng} personal={personal} />;
}
