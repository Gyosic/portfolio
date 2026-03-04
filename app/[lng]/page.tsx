import FramerWrapper from "@/components/animation/FramerWrapper";
import GithubBtn from "@/components/animation/GithubBtn";
import { HomePageChat } from "@/components/shared/ChatBot/HomePageChat";
import { MobileChatCTA } from "@/components/shared/ChatBot/MobileChatCTA";
import { FortuneBtn } from "@/components/shared/FortuneBtn";
import HeroTexts from "@/components/shared/HeroTexts";
import { personal } from "@/config";
import type { I18nextPageParams } from "@/lib/i18n/config";

interface DefaultPageProps {
  params: I18nextPageParams;
}

export default async function Page({ params }: DefaultPageProps) {
  const { lng: lngParams } = await params;

  return (
    <div className="flex h-full w-full items-center justify-between px-40 pt-14 max-sm:items-start max-md:p-4 max-md:pt-20">
      {/* LEFT SIDE  */}
      <FramerWrapper className="flex w-auto flex-1 flex-col justify-start gap-4" y={0} x={-100}>
        <HeroTexts lng={lngParams} personal={personal} />
        <FortuneBtn lng={lngParams} personal={personal} />
        {/* Mobile: prominent chat CTA button */}
        <MobileChatCTA lng={lngParams} />
      </FramerWrapper>
      {/* RIGHT SIDE: inline chatbot (desktop only) */}
      <FramerWrapper className="relative block h-[500px] flex-1 max-lg:hidden" y={0} x={100}>
        <HomePageChat lng={lngParams} personal={personal} />
      </FramerWrapper>

      {/* GITHUB BUTTON  */}
      <GithubBtn />
    </div>
  );
}
