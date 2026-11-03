import { create } from "zustand";
import type { ChatActivity } from "@/types/socket.type";

const TYPING_TIMEOUT_MS = 6000;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

type TypingState = {
  byConversation: Record<string, ChatActivity>;
  setTyping: (
    conversationId: string,
    isTyping: boolean,
    kind?: ChatActivity,
  ) => void;
  clear: () => void;
};

export const useTypingStore = create<TypingState>()((set, get) => ({
  byConversation: {},

  setTyping: (conversationId, isTyping, kind = "typing") => {
    const timer = timers.get(conversationId);
    if (timer) clearTimeout(timer);
    timers.delete(conversationId);

    if (isTyping) {
      timers.set(
        conversationId,
        setTimeout(
          () => get().setTyping(conversationId, false),
          TYPING_TIMEOUT_MS,
        ),
      );

      if (get().byConversation[conversationId] === kind) return;
      set((state) => ({
        byConversation: { ...state.byConversation, [conversationId]: kind },
      }));
      return;
    }

    if (!get().byConversation[conversationId]) return;
    set((state) => {
      const byConversation = { ...state.byConversation };
      delete byConversation[conversationId];
      return { byConversation };
    });
  },

  clear: () => {
    timers.forEach(clearTimeout);
    timers.clear();
    set({ byConversation: {} });
  },
}));

export const useChatActivity = (conversationId: string | undefined) =>
  useTypingStore((state) =>
    conversationId ? (state.byConversation[conversationId] ?? null) : null,
  );

export const useIsTyping = (conversationId: string | undefined) =>
  useChatActivity(conversationId) !== null;
