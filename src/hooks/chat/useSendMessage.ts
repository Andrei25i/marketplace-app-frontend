import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatOutboxStore } from "@/store/useChatOutboxStore";
import type {
  ChatMessage,
  MessageAdRef,
  VoiceRecording,
} from "@/types/chat.type";
import {
  createClientId,
  MAX_ATTACHMENTS,
  MAX_MESSAGE_LENGTH,
  MIN_VOICE_MS,
} from "@/utils/chat.util";
import { useMutation } from "@tanstack/react-query";
import { upsertMessage } from "./chatCache";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback } from "react";
import axios from "axios";

const outbox = () => useChatOutboxStore.getState();

const revokeLocalPreviews = (message: ChatMessage) => {
  message.attachments.forEach((attachment) => {
    if (attachment.url.startsWith("blob:")) URL.revokeObjectURL(attachment.url);
  });
};

const buildLocalMessage = (
  conversationId: string,
  senderId: string,
  content: string,
  ad: MessageAdRef | null,
  files: File[],
  voice?: VoiceRecording,
): ChatMessage => {
  const clientId = createClientId();

  const attachments: ChatMessage["attachments"] = voice
    ? [
        {
          id: `local-${clientId}-0`,
          kind: "audio",
          url: URL.createObjectURL(voice.file),
          width: null,
          height: null,
          duration_ms: Math.round(voice.durationMs),
        },
      ]
    : files.map((file, index) => ({
        id: `local-${clientId}-${index}`,
        kind: "image",
        url: URL.createObjectURL(file),
        width: null,
        height: null,
        duration_ms: null,
      }));

  return {
    id: `local-${clientId}`,
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    client_id: clientId,
    ad,
    attachments,
    status: "sent",
    created_at: new Date().toISOString(),
    edited_at: null,
    deleted_at: null,
    delivered_at: null,
    read_at: null,
    local_status: "sending",
    local_files: files,
    ...(voice ? { local_voice: voice } : {}),
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
    mutationFn: async (message: ChatMessage) => {
      const clientId = message.client_id as string;
      let attachmentIds = message.local_attachment_ids ?? [];

      if (attachmentIds.length === 0) {
        const uploaded = message.local_voice
          ? [
              await chatService.uploadVoice(
                message.conversation_id,
                message.local_voice,
              ),
            ]
          : message.local_files?.length
            ? await chatService.uploadAttachments(
                message.conversation_id,
                message.local_files,
              )
            : [];

        attachmentIds = uploaded.map((attachment) => attachment.id);
        if (attachmentIds.length > 0) {
          outbox().patch(message.conversation_id, clientId, {
            local_attachment_ids: attachmentIds,
          });
        }
      }

      return chatService.sendMessage(message.conversation_id, {
        content: message.content ?? "",
        clientId,
        adId: message.ad?.id ?? null,
        attachmentIds,
      });
    },

    onMutate: (message) => {
      outbox().add({ ...message, local_status: "sending" });
    },

    onSuccess: (saved, message) => {
      upsertMessage(saved);
      outbox().remove(message.conversation_id, message.client_id as string);
      revokeLocalPreviews(message);
    },

    onError: (error, message) => {
      onFailed?.();

      const clientId = message.client_id as string;
      outbox().setStatus(message.conversation_id, clientId, "failed");

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        outbox().patch(message.conversation_id, clientId, {
          local_attachment_ids: undefined,
        });
      }

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
          : getErrorMessage(error, "Încearcă să îl trimiți din nou."),
      });
    },
  });

  const send = (
    content: string,
    ad: MessageAdRef | null = null,
    files: File[] = [],
  ): boolean => {
    const text = content.trim();

    if (!conversationId || userId == null) return false;
    if (text.length > MAX_MESSAGE_LENGTH) return false;
    if (files.length > MAX_ATTACHMENTS) return false;
    if (!text && files.length === 0) return false;

    mutate(buildLocalMessage(conversationId, String(userId), text, ad, files));
    return true;
  };

  const sendVoice = (
    voice: VoiceRecording,
    ad: MessageAdRef | null = null,
  ): boolean => {
    if (!conversationId || userId == null) return false;
    if (voice.durationMs < MIN_VOICE_MS) return false;

    mutate(
      buildLocalMessage(conversationId, String(userId), "", ad, [], voice),
    );
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
    revokeLocalPreviews(message);
  }, []);

  return { send, sendVoice, retry, discard };
};

export default useSendMessage;
