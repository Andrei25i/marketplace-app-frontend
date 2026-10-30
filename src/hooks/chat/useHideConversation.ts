import { chatService } from "@/services/chat.service";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { invalidateUnread, removeConversation } from "./chatCache";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

const useHideConversation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (conversationId: string) =>
      chatService.hideConversation(conversationId),

    onSuccess: (_data, conversationId) => {
      navigate("/messages", { replace: true });
      removeConversation(conversationId);
      invalidateUnread();

      notifications.show({
        color: "green",
        message: "Conversația a fost ștearsă.",
      });
    },

    onError: (error) => {
      notifications.show({
        color: "red",
        title: "Conversația nu a putut fi ștearsă",
        message: getErrorMessage(error),
      });
    },
  });
};

export default useHideConversation;
