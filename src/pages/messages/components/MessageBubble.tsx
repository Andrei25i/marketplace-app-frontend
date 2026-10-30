import type { ChatMessage } from "@/types/chat.type";
import { getDisplayStatus, isDeletedMessage } from "@/utils/chat.util";
import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { type ReactNode } from "react";
import classes from "../Messages.module.css";
import { Link } from "react-router-dom";
import { IconBan, IconRefresh, IconX } from "@tabler/icons-react";
import { formatMessageTime } from "@/utils/chatTime.util";
import MessageStatusIcon from "./MessageStatusIcon";
import MessageTimeDetails from "./MessageTimeDetails";

type MessageBubbleProps = {
  message: ChatMessage;
  isOwn: boolean;
  grouped: boolean;
  onRetry: (message: ChatMessage) => void;
  onDiscard: (message: ChatMessage) => void;
  actions?: ReactNode;
};

const MessageBubble = ({
  message,
  isOwn,
  grouped,
  onRetry,
  onDiscard,
  actions,
}: MessageBubbleProps) => {
  const status = getDisplayStatus(message);
  const isDeleted = isDeletedMessage(message);

  return (
    <Stack
      gap={2}
      align={isOwn ? "flex-end" : "flex-start"}
      mt={grouped ? 0 : "xs"}
    >
      <Group
        gap={4}
        wrap="nowrap"
        justify={isOwn ? "flex-end" : "flex-start"}
        w="100%"
      >
        {isOwn && actions}

        <Box
          className={classes.bubble}
          data-own={isOwn || undefined}
          data-deleted={isDeleted || undefined}
          style={{ opacity: message.local_status === "sending" ? 0.75 : 1 }}
        >
          {message.ad && !isDeleted && (
            <Anchor
              component={Link}
              to={`/ads/${message.ad.id}`}
              size="xs"
              className={classes.adRef}
              lineClamp={1}
            >
              Despre: {message.ad.title}
            </Anchor>
          )}
          {isDeleted ? (
            <Group gap={4} wrap="nowrap">
              <IconBan size={14} />
              <Text size="sm" fs="italic">
                Mesaj șters
              </Text>
            </Group>
          ) : (
            <Text size="sm" className={classes.content}>
              {message.content}
            </Text>
          )}

          <Group gap={4} justify="flex-end" wrap="nowrap" mt={2}>
            {message.edited_at && !isDeleted && (
              <Text component="span" className={classes.meta}>
                editat
              </Text>
            )}

            <MessageTimeDetails
              message={message}
              isOwn={isOwn}
              position={isOwn ? "left" : "right"}
            >
              <Group gap={3} wrap="nowrap" style={{ cursor: "pointer" }}>
                <Text component="span" className={classes.meta}>
                  {formatMessageTime(message.created_at)}
                </Text>
                {isOwn && !isDeleted && (
                  <MessageStatusIcon status={status} size={15} onPrimary />
                )}
              </Group>
            </MessageTimeDetails>
          </Group>
        </Box>

        {!isOwn && actions}
      </Group>

      {status === "failed" && (
        <Group gap={4}>
          <Button
            size="compact-xs"
            variant="subtle"
            color="red"
            onClick={() => onRetry(message)}
          >
            <IconRefresh size={14} />
          </Button>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="gray"
            aria-label="Renunță la mesaj"
            onClick={() => onDiscard(message)}
          >
            <IconX size={14} />
          </ActionIcon>
        </Group>
      )}
    </Stack>
  );
};

export default MessageBubble;
