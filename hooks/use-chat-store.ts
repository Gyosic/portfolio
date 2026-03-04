import { create } from "zustand";

interface ChatStore {
  isOpen: boolean;
  isHomePage: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: AI SDK UIMessage compatibility
  messages: any[];
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setIsHomePage: (value: boolean) => void;
  // biome-ignore lint/suspicious/noExplicitAny: AI SDK UIMessage compatibility
  setMessages: (messages: any[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  isHomePage: false,
  messages: [],
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  setIsHomePage: (value) => set({ isHomePage: value }),
  setMessages: (messages) => set({ messages }),
}));
