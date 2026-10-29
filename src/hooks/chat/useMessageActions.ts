import { chatService } from "@/services/chat.service";
import { useMutation } from "@tanstack/react-query";
import { upsertMessage } from "./chatCache";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

type EditVariables = {
  messageId: string;
  content: string;
};

const useMessageActions = (conversationId?: string) => {
  const editMessage = useMutation({
    mutationFn: ({ messageId, content }: EditVariables) =>
      chatService.editMessage(conversationId as string, messageId, content),
    onSuccess: upsertMessage,
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Mesajul nu a putut fi editat",
        message: getErrorMessage(error),
      });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: (messageId: string) =>
      chatService.deleteMessage(conversationId as string, messageId),
    onSuccess: upsertMessage,
    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Mesajul nu a putut fi șters",
        message: getErrorMessage(error),
      });
    },
  });

  return { editMessage, deleteMessage };
};

export default useMessageActions;
