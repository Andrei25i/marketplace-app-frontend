import { queryClient } from "@/api/queryClient";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  ConversationReadPayload,
  ConversationSummaryDTO,
  MessageDTO,
  MessagesDeliveredPayload,
  Paginated,
} from "@/types/chat.type";
import type { InfiniteData } from "@tanstack/react-query";
import { chatKeys } from "./chatKeys";

export type MessagesData = InfiniteData<Paginated<MessageDTO>, string | null>;
export type ConversationsData = InfiniteData<
  Paginated<ConversationSummaryDTO>,
  string | null
>;

const currentUserId = (): string | null => {
  const id = useAuthStore.getState().user?.id;
  return id == null ? null : String(id);
};

const isSameMessage = (a: MessageDTO, b: MessageDTO) =>
  a.id === b.id ||
  (a.client_id !== null &&
    a.client_id === b.client_id &&
    a.sender_id === b.sender_id);

const mergeMessage = (
  current: MessageDTO,
  incoming: MessageDTO,
): MessageDTO => {
  const delivered_at = incoming.delivered_at ?? current.delivered_at;
  const read_at = incoming.read_at ?? current.read_at;

  return {
    ...incoming,
    delivered_at,
    read_at,
    status: read_at ? "read" : delivered_at ? "delivered" : "sent",
  };
};

const mapMessages = (
  conversationId: string,
  update: (message: MessageDTO) => MessageDTO,
) => {
  queryClient.setQueryData<MessagesData>(
    chatKeys.messages(conversationId),
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map(update),
        })),
      },
  );
};

const mapConversation = (
  conversationId: string,
  update: (conversation: ConversationSummaryDTO) => ConversationSummaryDTO,
) => {
  queryClient.setQueryData<ConversationSummaryDTO>(
    chatKeys.conversation(conversationId),
    (conversation) => conversation && update(conversation),
  );

  queryClient.setQueryData<ConversationsData>(
    chatKeys.conversations(),
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map((c) =>
            c.id === conversationId ? update(c) : c,
          ),
        })),
      },
  );
};

const findInConversationList = (conversationId: string) =>
  queryClient
    .getQueryData<ConversationsData>(chatKeys.conversations())
    ?.pages.flatMap((page) => page.items)
    .find((c) => c.id === conversationId);

const moveConversationToTop = (conversation: ConversationSummaryDTO) => {
  queryClient.setQueryData<ConversationsData>(
    chatKeys.conversations(),
    (data) => {
      if (!data) return data;

      const pages = data.pages.map((page) => ({
        ...page,
        items: page.items.filter((c) => c.id !== conversation.id),
      }));
      const [first, ...rest] = pages;
      if (!first) return data;

      return {
        ...data,
        pages: [{ ...first, items: [conversation, ...first.items] }, ...rest],
      };
    },
  );
};

const updatePreview = (message: MessageDTO) => {
  const apply = (conv: ConversationSummaryDTO): ConversationSummaryDTO => {
    const last = conv.last_message;

    if (last && last.id === message.id) {
      return { ...conv, last_message: mergeMessage(last, message) };
    }

    if (!last || message.created_at >= last.created_at) {
      return {
        ...conv,
        last_message: message,
        last_message_at: message.created_at,
      };
    }

    return conv;
  };

  queryClient.setQueryData<ConversationSummaryDTO>(
    chatKeys.conversation(message.conversation_id),
    (conversation) => conversation && apply(conversation),
  );

  const inList = findInConversationList(message.conversation_id);

  if (!inList) {
    void queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    return;
  }

  const updated = apply(inList);
  if (updated === inList) return;

  if (updated.last_message_at !== inList.last_message_at) {
    moveConversationToTop(updated);
  } else {
    mapConversation(message.conversation_id, () => updated);
  }
};

// API

export const getCachedConversation = (conversationId: string) =>
  queryClient.getQueryData<ConversationSummaryDTO>(
    chatKeys.conversation(conversationId),
  ) ?? findInConversationList(conversationId);

export const upsertMessage = (message: MessageDTO) => {
  queryClient.setQueryData<MessagesData>(
    chatKeys.messages(message.conversation_id),
    (data) => {
      if (!data) return data;

      let found = false;
      const pages = data.pages.map((page) => ({
        ...page,
        items: page.items.map((item) => {
          if (!isSameMessage(item, message)) return item;
          found = true;
          return mergeMessage(item, message);
        }),
      }));

      if (found) return { ...data, pages };

      const [newest, ...older] = pages;
      if (!newest) return data;

      return {
        ...data,
        pages: [{ ...newest, items: [...newest.items, message] }, ...older],
      };
    },
  );

  updatePreview(message);
};

export const upsertConversation = (conversation: ConversationSummaryDTO) => {
  queryClient.setQueryData(
    chatKeys.conversation(conversation.id),
    conversation,
  );

  if (conversation.last_message) {
    moveConversationToTop(conversation);
  }
};

export const removeConversation = (conversationId: string) => {
  queryClient.setQueryData<ConversationsData>(
    chatKeys.conversations(),
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.filter((c) => c.id !== conversationId),
        })),
      },
  );

  queryClient.removeQueries({
    queryKey: chatKeys.conversation(conversationId),
  });
  queryClient.removeQueries({ queryKey: chatKeys.messages(conversationId) });
};

export const applyConversationRead = ({
  conversationId,
  readerId,
  readAt,
  upTo,
}: ConversationReadPayload) => {
  const markRead = (message: MessageDTO): MessageDTO =>
    message.sender_id !== readerId &&
    !message.read_at &&
    message.created_at <= upTo
      ? {
          ...message,
          read_at: readAt,
          delivered_at: message.delivered_at ?? readAt,
          status: "read",
        }
      : message;

  mapMessages(conversationId, markRead);

  const readByMe = readerId === currentUserId();

  mapConversation(conversationId, (conv) => ({
    ...conv,
    last_message: conv.last_message ? markRead(conv.last_message) : null,
    unread_count: readByMe ? 0 : conv.unread_count,
  }));
};

export const applyMessagesDelivered = ({
  conversationId,
  messageIds,
  deliveredAt,
}: MessagesDeliveredPayload) => {
  const ids = new Set(messageIds);

  const markDelivered = (message: MessageDTO): MessageDTO =>
    ids.has(message.id) && !message.delivered_at
      ? {
          ...message,
          delivered_at: deliveredAt,
          status: message.read_at ? "read" : "delivered",
        }
      : message;

  mapMessages(conversationId, markDelivered);
  mapConversation(conversationId, (conv) => ({
    ...conv,
    last_message: conv.last_message ? markDelivered(conv.last_message) : null,
  }));
};

export const setUnreadTotal = (total: number) => {
  queryClient.setQueryData(chatKeys.unread(), total);
};

export const changeUnreadTotal = (delta: number) => {
  const current = queryClient.getQueryData<number>(chatKeys.unread());

  if (current === undefined) {
    invalidateUnread();
    return;
  }

  setUnreadTotal(Math.max(0, current + delta));
};

export const invalidateUnread = () => {
  void queryClient.invalidateQueries({ queryKey: chatKeys.unread() });
};

export const invalidateChat = () => {
  void queryClient.invalidateQueries({ queryKey: chatKeys.all });
};
