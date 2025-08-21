import { ClipboardClock } from "lucide-react";
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/shared/Heading";
import { Badge } from "@/components/ui/badge";
import { HistoryType, historyStatus } from "@/lib/schema/history.schema";

const exchangeStatus = (value: string) => {
  const status = Object.entries(historyStatus).find(([, status]) => value === status);

  if (status) return status[0];

  return value;
};

interface HistoryProps {
  histories: HistoryType[];
}
export function History({ histories }: HistoryProps) {
  return (
    // ABOUT PAGE
    <div className="relative flex h-full w-full flex-col justify-center gap-5 overflow-hidden px-40 pt-14 pb-4 max-sm:justify-start max-md:p-4 max-md:pt-20">
      <Badge variant="secondary" className="gap-1.5 py-1">
        <ClipboardClock className="h-4 w-4" />
        History
      </Badge>
      <div className="flex flex-col gap-3">
        <Heading>My History</Heading>
      </div>
      <div className="flex h-fit w-full flex-col">
        {histories.map((his, index) => (
          <div className="flex h-fit w-full" key={index}>
            <FramerWrapper
              y={0}
              x={-100}
              delay={0.35 + index * 0.1}
              className="flex w-1/4 flex-col items-start justify-evenly font-rubik text-lg max-sm:text-base"
            >
              <span>{`${his.start} ~ ${his?.end ?? "재직중"}`}</span>
            </FramerWrapper>
            <FramerWrapper
              y={0}
              x={100}
              delay={0.35 + index * 0.1}
              className="history_point relative w-3/4 gap-3 border-l-4 border-l-[#3c3c3c] p-4"
            >
              <div className="flex flex-col gap-2 font-rubik text-2xl max-sm:text-xl">
                <span>{`${his.company}`}</span>
                <div className="flex gap-2">
                  <span
                    className={`inline-flex items-center rounded-full bg-teal-100 px-2.5 py-0.5 font-medium text-teal-800 text-xs`}
                  >
                    {exchangeStatus(his.status)}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 font-medium text-xs text-yellow-800`}
                  >
                    {his.position}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs`}
                  >
                    {his.role}
                  </span>
                </div>
              </div>
              <p className="w-full font-poppins text-base text-primary max-sm:text-xs">
                {his.description}
              </p>
            </FramerWrapper>
          </div>
        ))}
      </div>
    </div>
  );
}
