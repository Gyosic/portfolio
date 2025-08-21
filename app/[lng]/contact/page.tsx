import { Contact } from "@/app/[lng]/contact/Contact";
import { I18nextPageParams } from "@/lib/i18n/config";

interface ContactPageProps {
  params: I18nextPageParams;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lng } = await params;
  return <Contact lng={lng} />;
}
