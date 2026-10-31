import type { ConversationSummaryDTO } from "@/types/chat.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { chatKeys } from "./chatKeys";
import { chatService } from "@/services/chat.service";
import { useMemo } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { shouldRefetchOnFocus } from "@/realtime/socket";

const NO_CONVERSATIONS: ConversationSummaryDTO[] = [];

const useConversations = () => {
  const query = useInfiniteQuery({
    queryKey: chatKeys.conversations(),
    queryFn: ({ pageParam }) => chatService.getConversations(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: shouldRefetchOnFocus,
  });

  const conversations = useMemo(() => {
    if (!query.data) return NO_CONVERSATIONS;

    const seen = new Set<string>();
    return query.data.pages
      .flatMap((page) => page.items)
      .filter((conversation) => {
        if (seen.has(conversation.id)) return false;
        seen.add(conversation.id);
        return true;
      });
  }, [query.data]);

  return {
    conversations,
    isLoading: query.isLoading,
    error: query.error
      ? getErrorMessage(query.error, "Nu s-au putut încărca conversațiile.")
      : "",
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

export default useConversations;
