import { Phone } from "lucide-react";
import FramerWrapper from "@/components/animation/FramerWrapper";
import Heading from "@/components/shared/Heading";
import { Badge } from "@/components/ui/badge";
import { Language } from "@/lib/i18n/config";
import { ContactForm } from "./ContactForm";

interface ContactProps {
  lng: Language;
}
export function Contact({ lng }: ContactProps) {
  return (
    // PROJECT PAGE
    <div className="relative flex h-full w-full flex-col items-start justify-center gap-5 overflow-hidden px-40 pt-14 pb-4 max-sm:justify-start max-md:p-4 max-md:pt-20">
      <Badge variant="secondary" className="gap-1.5 py-1">
        <Phone className="h-4 w-4" />
        Contact Us
      </Badge>
      <div className="flex w-full flex-col gap-3">
        <Heading>Contact Me!</Heading>
        <div className="flex h-auto w-full items-center justify-center">
          <FramerWrapper y={0} scale={0.8} className="min-w-100">
            <ContactForm lng={lng} />
          </FramerWrapper>
        </div>
        <p className="w-full font-poppins text-lg text-primary max-sm:text-base"></p>
      </div>
    </div>
  );
}
