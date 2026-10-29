import { useQuery } from "@tanstack/react-query";
import { chatKeys } from "./chatKeys";
import { chatService } from "@/services/chat.service";
import { getCachedConversation } from "./chatCache";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

const useConversation = (conversationId?: string) => {
  const query = useQuery({
    queryKey: chatKeys.conversation(conversationId ?? ""),
    queryFn: () => chatService.getConversation(conversationId as string),
    enabled: Boolean(conversationId),
    placeholderData: () =>
      conversationId ? getCachedConversation(conversationId) : undefined,
    refetchOnWindowFocus: true,
  });

  return {
    conversation: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error
      ? getErrorMessage(query.error, "Conversația nu a putut fi încărcată.")
      : "",
    refetch: query.refetch,
  };
};

export default useConversation;
