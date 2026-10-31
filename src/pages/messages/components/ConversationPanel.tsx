import { Box, Button, Center, Text } from "@mantine/core";
import { IconArrowDown } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import useChatScroll from "@/hooks/chat/useChatScroll";
import useConversation from "@/hooks/chat/useConversation";
import useMarkConversationRead from "@/hooks/chat/useMarkConversationRead";
import useMessages from "@/hooks/chat/useMessages";
import useSendMessage from "@/hooks/chat/useSendMessage";
import type { ChatLocationState } from "@/hooks/chat/useStartConversation";
import { useAuthStore } from "@/store/useAuthStore";
import type { ChatMessage, MessageAdRef } from "@/types/chat.type";
import ConversationHeader from "./ConversationHeader";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import classes from "../Messages.module.css";
import useMessageActions from "@/hooks/chat/useMessageActions";
import useHideConversation from "@/hooks/chat/useHideConversation";
import ConversationMenu from "./ConversationMenu";
import ChatConfirmModal from "./ChatConfirmModal";
import { isOwnMessage } from "@/utils/chat.util";
import usePresenceSubscription from "@/hooks/chat/usePresenceSubscription";

type ConversationPanelProps = {
  conversationId: string;
};

const ConversationPanel = ({ conversationId }: ConversationPanelProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id);

  const {
    conversation,
    error: conversationError,
    refetch: refetchConversation,
  } = useConversation(conversationId);

  usePresenceSubscription(conversation ? [conversation.other_user.id] : []);

  const {
    messages,
    isLoading,
    error,
    refetch,
    loadOlder,
    hasOlder,
    isLoadingOlder,
  } = useMessages(conversationId);

  const [unreadMarker, setUnreadMarker] = useState<{
    messageId: string | null;
    count: number;
  } | null>(null);

  if (unreadMarker === null && !isLoading && messages.length > 0) {
    const unread = messages.filter(
      (m) => !m.local_status && !m.read_at && !isOwnMessage(m, userId),
    );

    setUnreadMarker({
      messageId: unread[0]?.id ?? null,
      count: Math.max(unread.length, conversation?.unread_count ?? 0),
    });
  }

  const { send, retry, discard } = useSendMessage(conversationId);
  const { editMessage, deleteMessage } = useMessageActions(conversationId);
  const hideConversation = useHideConversation();

  const [editing, setEditing] = useState<ChatMessage | null>(null);
  const [deleting, setDeleting] = useState<ChatMessage | null>(null);
  const [isHideOpen, setIsHideOpen] = useState(false);

  const loadOlderPage = useCallback(() => {
    void loadOlder();
  }, [loadOlder]);

  const { viewportRef, onScroll, isAtBottom, hasNewBelow, scrollToBottom } =
    useChatScroll({
      messages,
      userId,
      hasOlder,
      isLoadingOlder,
      loadOlder: loadOlderPage,
    });

  useMarkConversationRead(conversationId, messages, isAtBottom);

  const [ad, setAd] = useState<MessageAdRef | null>(
    () => (location.state as ChatLocationState | null)?.ad ?? null,
  );

  const clearAd = () => {
    setAd(null);
    navigate(location.pathname, { replace: true, state: null });
  };

  const handleSend = (content: string) => {
    const started = send(content, ad);
    if (!started) return false;

    if (ad) clearAd();
    if (unreadMarker?.messageId) setUnreadMarker({ messageId: null, count: 0 });

    return true;
  };

  const handleSaveEdit = (content: string) => {
    if (!editing) return;

    editMessage.mutate(
      { messageId: editing.id, content: content.trim() },
      { onSuccess: () => setEditing(null) },
    );
  };

  const handleConfirmDelete = async () => {
    if (!deleting) return;

    await deleteMessage.mutateAsync(deleting.id);
    if (editing?.id === deleting.id) setEditing(null);
  };

  if (conversationError && !conversation) {
    return (
      <Center h="100%" p="md">
        <RequestErrorAlert
          title="Conversație indisponibilă"
          message={conversationError}
          onRetry={refetchConversation}
        />
      </Center>
    );
  }

  return (
    <>
      <ConversationHeader
        conversation={conversation}
        actions={
          conversation && (
            <ConversationMenu
              otherUserId={conversation.other_user.id}
              onHide={() => setIsHideOpen(true)}
            />
          )
        }
      />

      <Box className={classes.panelBody}>
        <MessageList
          messages={messages}
          isLoading={isLoading}
          error={error}
          onReload={refetch}
          isLoadingOlder={isLoadingOlder}
          viewportRef={viewportRef}
          onScroll={onScroll}
          onRetry={retry}
          onDiscard={discard}
          editingId={editing?.id ?? null}
          onEdit={setEditing}
          onDelete={setDeleting}
          unreadMarkerId={unreadMarker?.messageId ?? null}
          unreadCount={unreadMarker?.count ?? 0}
        />

        {hasNewBelow && (
          <Button
            size="xs"
            radius="xl"
            leftSection={<IconArrowDown size={14} />}
            className={classes.jumpButton}
            onClick={scrollToBottom}
          >
            Mesaje noi
          </Button>
        )}
      </Box>

      <MessageComposer
        onSend={handleSend}
        ad={ad}
        onRemoveAd={clearAd}
        editing={editing}
        isSavingEdit={editMessage.isPending}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={() => setEditing(null)}
      />

      <ChatConfirmModal
        opened={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
        title="Ștergi mesajul?"
        confirmLabel="Șterge"
      >
        <Text size="sm" lh={1.5}>
          Mesajul va fi șters pentru amândoi. Acțiunea nu poate fi anulată.
        </Text>
      </ChatConfirmModal>

      <ChatConfirmModal
        opened={isHideOpen}
        onClose={() => setIsHideOpen(false)}
        onConfirm={() => hideConversation.mutateAsync(conversationId)}
        title="Ștergi conversația?"
        confirmLabel="Șterge"
      >
        <Text size="sm" lh={1.5}>
          Conversația dispare doar din lista ta. Dacă primești un mesaj nou,
          conversația reapare doar cu mesajele noi.
        </Text>
      </ChatConfirmModal>
    </>
  );
};

export default ConversationPanel;
