import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import { useAuthStore } from "@/store/useAuthStore";
import type { ChatMessage } from "@/types/chat.type";
import { Center, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { Fragment, memo, type RefObject } from "react";
import classes from "../Messages.module.css";
import { isSameDay } from "@/utils/chatTime.util";
import { isOwnMessage } from "@/utils/chat.util";
import MessageBubble from "./MessageBubble";
import DaySeparator from "./DaySeparator";
import UnreadSeparator from "./UnreadSeparator";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string;
  onReload: () => void;
  isLoadingOlder: boolean;
  viewportRef: RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  onRetry: (messages: ChatMessage) => void;
  onDiscard: (message: ChatMessage) => void;
  editingId: string | null;
  onEdit: (message: ChatMessage) => void;
  onDelete: (message: ChatMessage) => void;
  unreadMarkerId: string | null;
  unreadCount: number;
};

const MessageList = ({
  messages,
  isLoading,
  error,
  onReload,
  isLoadingOlder,
  viewportRef,
  onScroll,
  onRetry,
  onDiscard,
  editingId,
  onEdit,
  onDelete,
  unreadMarkerId,
  unreadCount,
}: MessageListProps) => {
  const userId = useAuthStore((state) => state.user?.id);

  if (isLoading) {
    return (
      <Center style={{ flex: 1 }}>
        <Loader color="primary" />
      </Center>
    );
  }

  if (error && messages.length === 0) {
    return (
      <Center style={{ flex: 1 }} p="md">
        <RequestErrorAlert compact message={error} onRetry={onReload} />
      </Center>
    );
  }

  return (
    <ScrollArea
      className={classes.scroll}
      classNames={{ viewport: classes.viewport }}
      viewportRef={viewportRef}
      onScrollPositionChange={onScroll}
      scrollbars="y"
      scrollbarSize={6}
      type="auto"
    >
      <Stack gap={4} px="lg" py="md">
        {isLoadingOlder && (
          <Center py="xs">
            <Loader size="sm" color="primary" />
          </Center>
        )}

        {messages.length === 0 && (
          <Stack align="center" gap={4} py="xl" ta="center">
            <Text fw={600} size="sm">
              Începe conversația
            </Text>
            <Text size="xs" c="dimmed">
              Scrie primul mesaj mai jos.
            </Text>
          </Stack>
        )}

        {messages.map((message, index) => {
          const previous = index > 0 ? messages[index - 1] : undefined;
          const newDay =
            !previous || !isSameDay(previous.created_at, message.created_at);
          const grouped = !newDay && previous?.sender_id === message.sender_id;

          const isOwn = isOwnMessage(message, userId);
          return (
            <Fragment key={message.client_id ?? message.id}>
              {newDay && !isLoadingOlder && (
                <DaySeparator date={message.created_at} />
              )}

              {message.id === unreadMarkerId && (
                <UnreadSeparator count={unreadCount} />
              )}

              <MessageBubble
                message={message}
                isOwn={isOwn}
                grouped={grouped}
                tail={!grouped}
                editing={message.id === editingId}
                onRetry={onRetry}
                onDiscard={onDiscard}
                userId={userId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </Fragment>
          );
        })}
      </Stack>
    </ScrollArea>
  );
};

export default memo(MessageList);
