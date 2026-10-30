import { useAuthStore } from "@/store/useAuthStore";
import type { ConversationSummaryDTO } from "@/types/chat.type";
import {
  formatUnreadCount,
  getDisplayStatus,
  getFullName,
  getMessagePreview,
  isOwnMessage,
} from "@/utils/chat.util";
import { Badge, Box, Group, Text, UnstyledButton } from "@mantine/core";
import { Link } from "react-router-dom";
import classes from "../Messages.module.css";
import ChatAvatar from "./ChatAvatar";
import { formatConversationTime } from "@/utils/chatTime.util";
import MessageStatusIcon from "./MessageStatusIcon";

type ConversationListItemProps = {
  conversation: ConversationSummaryDTO;
  active: boolean;
};

const ConversationListItem = ({
  conversation,
  active,
}: ConversationListItemProps) => {
  const userId = useAuthStore((state) => state.user?.id);
  const { other_user: otherUser, last_message: lastMessage } = conversation;

  const hasUnread = conversation.unread_count > 0;
  const isDeleted = Boolean(lastMessage?.deleted_at);
  const showStatus =
    lastMessage !== null && !isDeleted && isOwnMessage(lastMessage, userId);

  return (
    <UnstyledButton
      component={Link}
      to={`/messages/${conversation.id}`}
      className={classes.item}
      data-active={active || undefined}
    >
      <Group wrap="nowrap" gap="sm">
        <ChatAvatar user={otherUser} />

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" wrap="nowrap" gap="xs">
            <Text size="sm" fw={hasUnread ? 700 : 600} truncate>
              {getFullName(otherUser)}
            </Text>

            {conversation.last_message_at && (
              <Text
                size="xs"
                c={hasUnread ? "primary" : "dimmed"}
                fw={hasUnread ? 600 : 400}
                style={{ flexShrink: 0 }}
              >
                {formatConversationTime(conversation.last_message_at)}
              </Text>
            )}
          </Group>

          <Group justify="space-between" wrap="nowrap" gap="xs" mt={2}>
            <Group gap={4} wrap="nowrap" style={{ minWidth: 0 }}>
              {showStatus && (
                <MessageStatusIcon
                  status={getDisplayStatus(lastMessage)}
                  size={14}
                />
              )}

              <Text
                size="sm"
                c={hasUnread ? "dark" : "dimmed"}
                fw={hasUnread ? 600 : 400}
                fs={isDeleted ? "italic" : undefined}
                truncate
              >
                {getMessagePreview(lastMessage, userId)}
              </Text>
            </Group>

            {hasUnread && (
              <Badge size="sm" color="primary" style={{ flexShrink: 0 }}>
                {formatUnreadCount(conversation.unread_count)}
              </Badge>
            )}
          </Group>
        </Box>
      </Group>
    </UnstyledButton>
  );
};

export default ConversationListItem;
