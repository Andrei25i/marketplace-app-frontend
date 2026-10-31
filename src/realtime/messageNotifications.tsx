import { notifications } from "@mantine/notifications";
import { IconMessageCircle } from "@tabler/icons-react";
import type { MouseEvent } from "react";
import router from "@/routes/router";
import type { ConversationSummaryDTO, MessageDTO } from "@/types/chat.type";
import { getFullName } from "@/utils/chat.util";
import classes from "./messageNotifications.module.css";

const PREVIEW_LENGTH = 120;
const AUTO_CLOSE_MS = 6000;

const countByConversation = new Map<string, number>();

const isOnMessagesPage = () =>
  router.state.location.pathname.startsWith("/messages");

const truncate = (text: string) =>
  text.length > PREVIEW_LENGTH
    ? `${text.slice(0, PREVIEW_LENGTH).trimEnd()}…`
    : text;

export const notifyIncomingMessage = (
  message: MessageDTO,
  conversation: ConversationSummaryDTO,
) => {
  if (isOnMessagesPage()) return;

  const id = `chat-${conversation.id}`;
  const count = (countByConversation.get(conversation.id) ?? 0) + 1;
  countByConversation.set(conversation.id, count);

  const name = getFullName(conversation.other_user);

  const notification = {
    id,
    title: count > 1 ? `${name} · ${count} mesaje noi` : name,
    message: truncate(message.content ?? ""),
    icon: <IconMessageCircle size={18} />,
    color: "primary",
    autoClose: AUTO_CLOSE_MS,
    className: classes.clickable,
    onClick: (event: MouseEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("button")) return;

      notifications.hide(id);
      void router.navigate(`/messages/${conversation.id}`);
    },
    onClose: () => {
      countByConversation.delete(conversation.id);
    },
  };

  notifications.update(notification);
  notifications.show(notification);
};
