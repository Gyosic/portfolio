"use client";

import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/hooks/use-chat-store";

interface MobileChatCTAProps {
  lng: string;
}

export function MobileChatCTA({ lng }: MobileChatCTAProps) {
  const openChat = useChatStore((s) => s.openChat);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex w-full justify-center pt-4 lg:hidden"
    >
      <div className="relative">
        <span className="absolute -inset-1 animate-pulse rounded-full bg-primary/20" />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <Button
            onClick={openChat}
            size="lg"
            className="relative gap-3 rounded-full px-8 py-6 font-semibold text-base shadow-xl"
          >
            <MessageCircle className="size-5" />
            {lng === "ko" ? "AI에게 물어보세요" : "Chat with AI"}
            <Sparkles className="size-4 animate-pulse" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
