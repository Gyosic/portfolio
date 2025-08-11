import type { NextAuthRequest } from "next-auth/lib";

import type { Language } from "@/lib/i18n/config";
import { defaultNS, fallbackLng } from "@/lib/i18n/config";

interface PathParams {
  params: Promise<{
    lng: Language;
    ns: string;
  }>;
}

export async function GET(req: NextAuthRequest, { params }: PathParams) {
  const { lng = fallbackLng, ns = defaultNS } = await params;

  const { default: message } = await import(`@/lib/i18n/languages/${lng}/${ns}.json`);

  return Response.json(message);
}
