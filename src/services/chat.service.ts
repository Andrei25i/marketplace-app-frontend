import { api } from "@/api/api";
import type {
  ConversationSummaryDTO,
  MarkReadResponse,
  MessageDTO,
  Paginated,
  SendMessagePayload,
  UnreadCountResponse,
} from "@/types/chat.type";

export const chatService = {
  getConversations: async (
    cursor?: string | null,
  ): Promise<Paginated<ConversationSummaryDTO>> => {
    const { data } = await api.get<Paginated<ConversationSummaryDTO>>(
      "/conversations",
      { params: cursor ? { cursor } : undefined },
    );
    return data;
  },

  getConversation: async (
    conversationId: string,
  ): Promise<ConversationSummaryDTO> => {
    const { data } = await api.get<ConversationSummaryDTO>(
      `/conversations/${conversationId}`,
    );
    return data;
  },

  startConversation: async (
    recipientId: string,
  ): Promise<ConversationSummaryDTO> => {
    const { data } = await api.post<ConversationSummaryDTO>("/conversations", {
      recipientId,
    });
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await api.get<UnreadCountResponse>(
      "/conversations/unread-count",
    );
    return data.total;
  },

  getMessages: async (
    conversationId: string,
    before?: string | null,
  ): Promise<Paginated<MessageDTO>> => {
    const { data } = await api.get<Paginated<MessageDTO>>(
      `/conversations/${conversationId}/messages`,
      { params: before ? { before } : undefined },
    );
    return data;
  },

  sendMessage: async (
    conversationId: string,
    payload: SendMessagePayload,
  ): Promise<MessageDTO> => {
    const { data } = await api.post<MessageDTO>(
      `/conversations/${conversationId}/messages`,
      payload,
    );
    return data;
  },

  editMessage: async (
    conversationId: string,
    messageId: string,
    content: string,
  ): Promise<MessageDTO> => {
    const { data } = await api.patch<MessageDTO>(
      `/conversations/${conversationId}/messages/${messageId}`,
      { content },
    );
    return data;
  },

  deleteMessage: async (
    conversationId: string,
    messageId: string,
  ): Promise<MessageDTO> => {
    const { data } = await api.delete<MessageDTO>(
      `/conversations/${conversationId}/messages/${messageId}`,
    );
    return data;
  },

  markRead: async (
    conversationId: string,
    upToMessageId?: string | null,
  ): Promise<MarkReadResponse> => {
    const { data } = await api.post<MarkReadResponse>(
      `/conversations/${conversationId}/read`,
      { upToMessageId: upToMessageId ?? null },
    );
    return data;
  },

  hideConversation: async (conversationId: string): Promise<void> => {
    await api.delete(`/conversations/${conversationId}`);
  },
};
