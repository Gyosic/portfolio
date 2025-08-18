import FramerWrapper from "@/components/animation/FramerWrapper";
import GithubBtn from "@/components/animation/GithubBtn";
import { FortuneBtn } from "@/components/shared/FortuneBtn";
import HeroImage from "@/components/shared/HeroImage";
import HeroTexts from "@/components/shared/HeroTexts";
import { personal } from "@/config";
import { I18nextPageParams } from "@/lib/i18n/config";

interface DefaultPageProps extends React.PropsWithChildren {
  params: I18nextPageParams;
}

export default async function Page({ params }: DefaultPageProps) {
  const { lng } = await params;
  return (
    <div className="flex w-full justify-between">
      {/* LEFT SIDE  */}
      <FramerWrapper className="flex h-full w-auto flex-col justify-start gap-4" y={0} x={-100}>
        <HeroTexts lng={lng} personal={personal} />
        {/* <div className="h-fit w-full p-4 flex gap-4">
          <SocialLinks />
        </div>
        <DownLoadResumeBtn /> */}
        <FortuneBtn lng={lng} personal={personal} />
      </FramerWrapper>
      {/* RIGHT SIDE image  */}
      <FramerWrapper className="relative block h-full w-[47%] max-lg:hidden" y={0} x={100}>
        {/* IMAGE  */}
        <HeroImage />
      </FramerWrapper>

      {/* GITHUB BUTTON  */}
      <GithubBtn />
    </div>
  );
}
