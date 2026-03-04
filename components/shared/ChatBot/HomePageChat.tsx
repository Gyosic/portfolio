"use client";

import { useEffect } from "react";
import type { PersonalType } from "@/config";
import { useChatStore } from "@/hooks/use-chat-store";
import { ChatWindow } from "./ChatWindow";

interface HomePageChatProps {
  lng: string;
  personal: PersonalType;
}

export function HomePageChat({ lng, personal }: HomePageChatProps) {
  const setIsHomePage = useChatStore((s) => s.setIsHomePage);

  useEffect(() => {
    setIsHomePage(true);
    return () => setIsHomePage(false);
  }, [setIsHomePage]);

  return <ChatWindow lng={lng} personal={personal} variant="inline" />;
}
