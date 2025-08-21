import FramerWrapper from "@/components/animation/FramerWrapper";
import GithubBtn from "@/components/animation/GithubBtn";
import { FortuneBtn } from "@/components/shared/FortuneBtn";
import HeroImage from "@/components/shared/HeroImage";
import HeroTexts from "@/components/shared/HeroTexts";
import { personal } from "@/config";
import { I18nextPageParams } from "@/lib/i18n/config";

interface DefaultPageProps {
  params: I18nextPageParams;
}

export default async function Page({ params }: DefaultPageProps) {
  const { lng: lngParams } = await params;
  return (
    <div className="flex w-full justify-between px-40">
      {/* LEFT SIDE  */}
      <FramerWrapper
        className="flex h-full w-auto flex-1 flex-col justify-start gap-4"
        y={0}
        x={-100}
      >
        <HeroTexts lng={lngParams} personal={personal} />
        {/* <div className="h-fit w-full p-4 flex gap-4">
          <SocialLinks />
        </div>
        <DownLoadResumeBtn /> */}
        <FortuneBtn lng={lngParams} personal={personal} />
      </FramerWrapper>
      {/* RIGHT SIDE image  */}
      <FramerWrapper className="relative block h-full flex-1 max-lg:hidden" y={0} x={100}>
        {/* IMAGE  */}
        <HeroImage />
      </FramerWrapper>

      {/* GITHUB BUTTON  */}
      <GithubBtn />
    </div>
  );
}
