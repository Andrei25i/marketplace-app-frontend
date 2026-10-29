import type { ChatMessage, LocalMessageStatus } from "@/types/chat.type";
import { create } from "zustand";

type ChatOutboxState = {
  byConversation: Record<string, ChatMessage[]>;
  add: (message: ChatMessage) => void;
  setStatus: (
    convesationId: string,
    clientId: string,
    status: LocalMessageStatus,
  ) => void;
  remove: (conversationId: string, clientId: string) => void;
  clear: () => void;
};

export const useChatOutboxStore = create<ChatOutboxState>()((set) => ({
  byConversation: {},

  add: (message) =>
    set((state) => {
      const current = state.byConversation[message.conversation_id] ?? [];
      return {
        byConversation: {
          ...state.byConversation,
          [message.conversation_id]: [
            ...current.filter((m) => m.client_id !== message.client_id),
            message,
          ],
        },
      };
    }),

  setStatus: (conversationId, clientId, status) =>
    set((state) => {
      const current = state.byConversation[conversationId];
      if (!current) return state;
      return {
        byConversation: {
          ...state.byConversation,
          [conversationId]: current.map((m) =>
            m.client_id === clientId ? { ...m, local_status: status } : m,
          ),
        },
      };
    }),

  remove: (conversationId, clientId) =>
    set((state) => {
      const current = state.byConversation[conversationId];
      if (!current) return state;
      return {
        byConversation: {
          ...state.byConversation,
          [conversationId]: current.filter((m) => m.client_id !== clientId),
        },
      };
    }),

  clear: () => set({ byConversation: {} }),
}));
