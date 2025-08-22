import { and, eq, sql } from "drizzle-orm";
import FramerWrapper from "@/components/animation/FramerWrapper";
import GithubBtn from "@/components/animation/GithubBtn";
import { FortuneBtn } from "@/components/shared/FortuneBtn";
import HeroImage from "@/components/shared/HeroImage";
import HeroTexts from "@/components/shared/HeroTexts";
import { personal } from "@/config";
import { I18nextPageParams } from "@/lib/i18n/config";
import { db } from "@/lib/pg";
import { UploadType } from "@/lib/schema/upload.schema";
import { uploads } from "@/lib/schema/upload.table";

export const dynamic = "force-dynamic";

const getImage = async () => {
  const [image] = await db
    .select()
    .from(uploads)
    .where(
      and(
        eq(uploads.type, "main"),
        eq(uploads.created_at, sql`(SELECT MAX(created_at) FROM ${uploads})`),
      ),
    )
    .limit(1);

  return image as UploadType;
};

interface DefaultPageProps {
  params: I18nextPageParams;
}

export default async function Page({ params }: DefaultPageProps) {
  const { lng: lngParams } = await params;

  const image = await getImage();

  return (
    <div className="flex h-full w-full items-center justify-between px-40 pt-14 max-sm:items-start max-md:p-4 max-md:pt-20">
      {/* LEFT SIDE  */}
      <FramerWrapper className="flex w-auto flex-1 flex-col justify-start gap-4" y={0} x={-100}>
        <HeroTexts lng={lngParams} personal={personal} />
        {/* <div className="h-fit w-full p-4 flex gap-4">
          <SocialLinks />
        </div>
        <DownLoadResumeBtn /> */}
        <FortuneBtn lng={lngParams} personal={personal} />
      </FramerWrapper>
      {/* RIGHT SIDE image  */}
      <FramerWrapper className="relative block flex-1 max-lg:hidden" y={0} x={100}>
        {/* IMAGE  */}
        <HeroImage image={image} />
      </FramerWrapper>

      {/* GITHUB BUTTON  */}
      <GithubBtn />
    </div>
  );
}
