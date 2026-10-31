import type { ChatMessage } from "@/types/chat.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { chatKeys } from "./chatKeys";
import { chatService } from "@/services/chat.service";
import { useChatOutboxStore } from "@/store/useChatOutboxStore";
import { useMemo } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { shouldRefetchOnFocus } from "@/realtime/socket";

const NO_MESSAGES: ChatMessage[] = [];

const compareMessages = (a: ChatMessage, b: ChatMessage) => {
  if (a.created_at !== b.created_at)
    return a.created_at < b.created_at ? -1 : 1;
  if (a.id === b.id) return 0;
  return a.id < b.id ? -1 : 1;
};

const useMessages = (conversationId?: string) => {
  const query = useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId ?? ""),
    queryFn: ({ pageParam }) =>
      chatService.getMessages(conversationId as string, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(conversationId),
    refetchOnWindowFocus: shouldRefetchOnFocus,
    refetchOnMount: shouldRefetchOnFocus,
  });

  const pending = useChatOutboxStore((state) =>
    conversationId
      ? (state.byConversation[conversationId] ?? NO_MESSAGES)
      : NO_MESSAGES,
  );

  const messages = useMemo<ChatMessage[]>(() => {
    const byId = new Map<string, ChatMessage>();

    for (const page of query.data?.pages ?? []) {
      for (const message of page.items) {
        if (!byId.has(message.id)) byId.set(message.id, message);
      }
    }

    const confirmed = [...byId.values()].sort(compareMessages);
    const confirmedClientIds = new Set(confirmed.map((m) => m.client_id));

    const stillPending = pending.filter(
      (m) => !confirmedClientIds.has(m.client_id),
    );

    return [...confirmed, ...stillPending];
  }, [query.data, pending]);

  return {
    messages,
    isLoading: query.isLoading,
    error: query.error
      ? getErrorMessage(query.error, "Mesajele nu au putut fi încărcate.")
      : "",
    refetch: query.refetch,
    loadOlder: query.fetchNextPage,
    hasOlder: query.hasNextPage,
    isLoadingOlder: query.isFetchingNextPage,
  };
};

export default useMessages;
