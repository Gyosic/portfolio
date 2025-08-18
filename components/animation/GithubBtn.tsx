import { Github } from "lucide-react";
import Link from "next/link";
import { personal } from "@/config";

const GithubBtn = () => {
  return (
    <Link
      href={personal.social.github || ""}
      target="blank"
      className="absolute bottom-16 left-0 z-50 flex h-fit w-fit animate-pulse items-center justify-center gap-2 rounded-r-full border-black border-y border-r p-2 shadow-md hover:animate-none hover:bg-primary hover:text-white sm:bottom-5"
    >
      <Github />
      <span className="font-rubik text-2xl max-sm:text-xl">Github</span>
    </Link>
  );
};

export default GithubBtn;
