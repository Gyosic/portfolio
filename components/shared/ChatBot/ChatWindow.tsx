"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PersonalType } from "@/config";
import { useChatStore } from "@/hooks/use-chat-store";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface ChatWindowProps {
  lng?: string;
  personal: PersonalType;
}

export function ChatWindow({ lng = "ko", personal }: ChatWindowProps) {
  const { closeChat } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const owner =
    lng === "ko"
      ? { name: personal.ko.name, title: personal.ko.title }
      : { name: personal.en.name, title: personal.en.title };

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat", body: { lng, owner } }),
    [lng, owner],
  );

  const { messages, sendMessage, status, error } = useChat({
    transport,
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text:
              lng === "ko"
                ? `안녕하세요! ${personal.ko.name}님에 대해 궁금한 점이 있으면 물어보세요.`
                : `Hi! Feel free to ask me anything about ${personal.en.name}.`,
          },
        ],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (error?.message?.includes("429") || error?.message?.includes("Too many")) {
      setRateLimited(true);
    }
  }, [error]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const placeholder = rateLimited
    ? lng === "ko"
      ? "요청 한도를 초과했습니다. 1시간 후 다시 시도해주세요."
      : "Rate limit exceeded. Please try again later."
    : lng === "ko"
      ? "프로젝트, 경력, 기술 등을 물어보세요..."
      : "Ask about projects, experience, skills...";

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || isLoading || rateLimited) return;
      sendMessage({ text });
    },
    [isLoading, rateLimited, sendMessage],
  );

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground text-sm">
            AI
          </div>
          <div>
            <p className="font-medium text-sm">
              {lng === "ko"
                ? `${personal.ko.name}님의 비서 챗봇`
                : `${personal.en.name}'s secretary chatbot`}
            </p>
            <p className="text-muted-foreground text-xs">
              {lng === "ko" ? "무엇이든 물어보세요" : "Ask me anything"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="size-8" onClick={closeChat}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {status === "submitted" && (
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                AI
              </div>
              <div className="rounded-2xl bg-muted px-3 py-2">
                <div className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput isLoading={isLoading} onSend={handleSend} placeholder={placeholder} />
    </div>
  );
}
