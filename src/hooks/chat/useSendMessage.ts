import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatOutboxStore } from "@/store/useChatOutboxStore";
import type { ChatMessage, MessageAdRef } from "@/types/chat.type";
import { createClientId, MAX_MESSAGE_LENGTH } from "@/utils/chat.util";
import { useMutation } from "@tanstack/react-query";
import { upsertMessage } from "./chatCache";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback } from "react";
import axios from "axios";

const outbox = () => useChatOutboxStore.getState();

const buildLocalMessage = (
  conversationId: string,
  senderId: string,
  content: string,
  ad: MessageAdRef | null,
): ChatMessage => {
  const clientId = createClientId();

  return {
    id: `local-${clientId}`,
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    client_id: clientId,
    ad,
    status: "sent",
    created_at: new Date().toISOString(),
    edited_at: null,
    deleted_at: null,
    delivered_at: null,
    read_at: null,
    local_status: "sending",
  };
};

type UseSendMessageOptions = {
  onFailed?: () => void;
};

const useSendMessage = (
  conversationId?: string,
  { onFailed }: UseSendMessageOptions = {},
) => {
  const userId = useAuthStore((state) => state.user?.id);

  const { mutate } = useMutation({
    mutationFn: (message: ChatMessage) =>
      chatService.sendMessage(message.conversation_id, {
        content: message.content ?? "",
        clientId: message.client_id as string,
        adId: message.ad?.id ?? null,
      }),

    onMutate: (message) => {
      outbox().add({ ...message, local_status: "sending" });
    },

    onSuccess: (saved, message) => {
      upsertMessage(saved);
      outbox().remove(message.conversation_id, message.client_id as string);
    },

    onError: (error, message) => {
      onFailed?.();

      outbox().setStatus(
        message.conversation_id,
        message.client_id as string,
        "failed",
      );

      const isRateLimited =
        axios.isAxiosError(error) && error.response?.status === 429;

      notifications.show({
        color: "red",
        title: "Mesajul nu a fost trimis",
        message: isRateLimited
          ? getErrorMessage(
              error,
              "Trimiți mesaje prea repede. Așteaptă câteva momente.",
            )
          : "Încearcă să îl trimiți din nou.",
      });
    },
  });

  const send = (content: string, ad: MessageAdRef | null = null): boolean => {
    const text = content.trim();

    if (!conversationId || userId == null) return false;
    if (!text || text.length > MAX_MESSAGE_LENGTH) return false;

    mutate(buildLocalMessage(conversationId, String(userId), text, ad));
    return true;
  };

  const retry = useCallback(
    (message: ChatMessage) => {
      mutate({ ...message, local_status: "sending" });
    },
    [mutate],
  );

  const discard = useCallback((message: ChatMessage) => {
    outbox().remove(message.conversation_id, message.client_id as string);
  }, []);

  return { send, retry, discard };
};

export default useSendMessage;
