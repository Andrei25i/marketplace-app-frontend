import { useDocumentVisibility } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { socket } from "@/realtime/socket";
import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { ChatMessage } from "@/types/chat.type";
import { isOwnMessage } from "@/utils/chat.util";
import { setReadingConversation } from "./activeConversation";
import {
  applyConversationRead,
  changeUnreadTotal,
  getCachedConversation,
  invalidateChat,
  invalidateUnread,
} from "./chatCache";

const READ_DEBOUNCE_MS = 300;

type ReadVariables = {
  upToMessageId: string;
  upTo: string;
};

const useMarkConversationRead = (
  conversationId: string | undefined,
  messages: ChatMessage[],
  enabled: boolean,
) => {
  const userId = useAuthStore((state) => state.user?.id);
  const visibility = useDocumentVisibility();
  const requestUpTo = useRef<string | null>(null);

  const isReading =
    Boolean(conversationId) && enabled && visibility === "visible";

  useEffect(() => {
    if (!isReading || !conversationId) return;

    setReadingConversation(conversationId);
    return () => setReadingConversation(null);
  }, [isReading, conversationId]);

  const { mutate } = useMutation({
    mutationFn: ({ upToMessageId }: ReadVariables) =>
      chatService.markRead(conversationId as string, upToMessageId),

    onMutate: ({ upTo }) => {
      if (!conversationId || userId == null) return;

      const unread = getCachedConversation(conversationId)?.unread_count ?? 0;
      if (unread > 0) changeUnreadTotal(-unread);

      applyConversationRead({
        conversationId,
        readerId: String(userId),
        readAt: new Date().toISOString(),
        upTo,
      });
    },

    onSuccess: () => {
      if (!socket.connected) invalidateUnread();
    },

    onError: () => {
      requestUpTo.current = null;
      invalidateChat();
    },
  });

  const lastUnread = useMemo(
    () =>
      messages.findLast(
        (m) => !m.local_status && !m.read_at && !isOwnMessage(m, userId),
      ) ?? null,
    [messages, userId],
  );

  useEffect(() => {
    if (!isReading || !lastUnread) return;
    if (requestUpTo.current === lastUnread.id) return;

    const timer = setTimeout(() => {
      requestUpTo.current = lastUnread.id;
      mutate({ upToMessageId: lastUnread.id, upTo: lastUnread.created_at });
    }, READ_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [isReading, lastUnread, mutate]);
};

export default useMarkConversationRead;
