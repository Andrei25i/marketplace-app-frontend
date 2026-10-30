import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { ChatMessage } from "@/types/chat.type";
import { useDocumentVisibility } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { applyConversationRead } from "./chatCache";
import { isOwnMessage } from "@/utils/chat.util";

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

  const { mutate } = useMutation({
    mutationFn: ({ upToMessageId }: ReadVariables) =>
      chatService.markRead(conversationId as string, upToMessageId),

    onSuccess: (result, { upTo }) => {
      if (!conversationId || userId == null) return;

      applyConversationRead({
        conversationId,
        readerId: String(userId),
        readAt: result.readAt ?? new Date().toISOString(),
        upTo,
      });
    },

    onError: () => {
      requestUpTo.current = null;
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
    if (!conversationId || !enabled || visibility !== "visible") return;
    if (!lastUnread || requestUpTo.current === lastUnread.id) return;

    const timer = setTimeout(() => {
      requestUpTo.current = lastUnread.id;
      mutate({ upToMessageId: lastUnread.id, upTo: lastUnread.created_at });
    }, READ_DEBOUNCE_MS);

    return () => clearInterval(timer);
  }, [conversationId, enabled, visibility, lastUnread, mutate]);
};

export default useMarkConversationRead;
