import { chatService } from "@/services/chat.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { MessageAdRef } from "@/types/chat.type";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { upsertConversation } from "./chatCache";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

export type ChatLocationState = {
  ad?: MessageAdRef;
};

type StartVariables = {
  recipientId: string;
  ad?: MessageAdRef;
};

const useStartConversation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const mutation = useMutation({
    mutationFn: ({ recipientId }: StartVariables) =>
      chatService.startConversation(recipientId),

    onSuccess: (conversation, { ad }) => {
      upsertConversation(conversation);

      const state: ChatLocationState | undefined = ad ? { ad } : undefined;
      navigate(`/messages/${conversation.id}`, { state });
    },

    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Conversația nu a putut fi deschisă",
        message: getErrorMessage(error),
      });
    },
  });

  const startConversation = (recipientId: string, ad?: MessageAdRef) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    mutation.mutate({ recipientId, ad });
  };

  return {
    startConversation,
    isStarting: mutation.isPending,
  };
};

export default useStartConversation;
