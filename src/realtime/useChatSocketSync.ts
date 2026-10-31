import {
  applyConversationRead,
  applyMessagesDelivered,
  changeUnreadTotal,
  removeConversation,
  setUnreadTotal,
  upsertConversation,
  upsertMessage,
} from "@/hooks/chat/chatCache";
import { useAuthStore } from "@/store/useAuthStore";
import type { ServerToClientEvents } from "@/types/socket.type";
import { socket } from "./socket";
import router from "@/routes/router";
import { useEffect } from "react";
import { notifyIncomingMessage } from "./messageNotifications";
import { isReadingConversation } from "@/hooks/chat/activeConversation";

const currentUserId = (): string | null => {
  const id = useAuthStore.getState().user?.id;
  return id == null ? null : String(id);
};

const onMessageNew: ServerToClientEvents["message:new"] = ({
  message,
  conversation,
}) => {
  const fromOther = message.sender_id !== currentUserId();
  const isReading = fromOther && isReadingConversation(conversation.id);

  upsertConversation(
    isReading ? { ...conversation, unread_count: 0 } : conversation,
  );
  upsertMessage(message);

  if (!fromOther) return;

  socket.emit("message:received", { messageIds: [message.id] });

  if (!isReading) {
    changeUnreadTotal(1);
    notifyIncomingMessage(message, conversation);
  }
};

const onMessageUpdated: ServerToClientEvents["message:updated"] = ({
  message,
}) => {
  upsertMessage(message);
};

const onConversationHidden: ServerToClientEvents["conversation:hidden"] = ({
  conversationId,
}) => {
  if (router.state.location.pathname === `/messages/${conversationId}`) {
    void router.navigate("/messages", { replace: true });
  }
  removeConversation(conversationId);
};

const onUnreadUpdated: ServerToClientEvents["unread:updated"] = ({ total }) => {
  setUnreadTotal(total);
};

const useChatSocketSync = () => {
  useEffect(() => {
    socket.on("message:new", onMessageNew);
    socket.on("message:updated", onMessageUpdated);
    socket.on("message:delivered", applyMessagesDelivered);
    socket.on("conversation:read", applyConversationRead);
    socket.on("conversation:hidden", onConversationHidden);
    socket.on("unread:updated", onUnreadUpdated);

    return () => {
      socket.off("message:new", onMessageNew);
      socket.off("message:updated", onMessageUpdated);
      socket.off("message:delivered", applyMessagesDelivered);
      socket.off("conversation:read", applyConversationRead);
      socket.off("conversation:hidden", onConversationHidden);
      socket.off("unread:updated", onUnreadUpdated);
    };
  }, []);
};

export default useChatSocketSync;
