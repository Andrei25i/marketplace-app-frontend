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
import { usePresenceStore } from "@/store/usePresenceStore";
import { resubscribePresence } from "./presence";
import { useTypingStore } from "@/store/useTypingStore";

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

  useTypingStore.getState().setTyping(conversation.id, false);
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

const onPresenceUpdate: ServerToClientEvents["presence:update"] = (
  presence,
) => {
  usePresenceStore.getState().set(presence);
};

const onTyping: ServerToClientEvents["typing"] = ({
  conversationId,
  userId,
  isTyping,
}) => {
  if (userId === currentUserId()) return;
  useTypingStore.getState().setTyping(conversationId, isTyping);
};

const clearTyping = () => useTypingStore.getState().clear();

const useChatSocketSync = () => {
  useEffect(() => {
    socket.on("message:new", onMessageNew);
    socket.on("message:updated", onMessageUpdated);
    socket.on("message:delivered", applyMessagesDelivered);
    socket.on("conversation:read", applyConversationRead);
    socket.on("conversation:hidden", onConversationHidden);
    socket.on("unread:updated", onUnreadUpdated);
    socket.on("presence:update", onPresenceUpdate);
    socket.on("connect", resubscribePresence);
    socket.on("typing", onTyping);
    socket.on("disconnect", clearTyping);

    return () => {
      socket.off("message:new", onMessageNew);
      socket.off("message:updated", onMessageUpdated);
      socket.off("message:delivered", applyMessagesDelivered);
      socket.off("conversation:read", applyConversationRead);
      socket.off("conversation:hidden", onConversationHidden);
      socket.off("unread:updated", onUnreadUpdated);
      socket.off("presence:update", onPresenceUpdate);
      socket.off("connect", resubscribePresence);
      socket.off("typing", onTyping);
      socket.off("disconnect", clearTyping);
    };
  }, []);
};

export default useChatSocketSync;
