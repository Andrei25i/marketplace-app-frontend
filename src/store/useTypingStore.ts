import { create } from "zustand";

const TYPING_TIMEOUT_MS = 6000;

const timers = new Map<string, ReturnType<typeof setTimeout>>();

type TypingState = {
  byConversation: Record<string, true>;
  setTyping: (conversationId: string, isTyping: boolean) => void;
  clear: () => void;
};

export const useTypingStore = create<TypingState>()((set, get) => ({
  byConversation: {},

  setTyping: (conversationId, isTyping) => {
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

      if (get().byConversation[conversationId]) return;
      set((state) => ({
        byConversation: { ...state.byConversation, [conversationId]: true },
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

export const useIsTyping = (conversationId: string | undefined) =>
  useTypingStore((state) =>
    conversationId ? Boolean(state.byConversation[conversationId]) : false,
  );
