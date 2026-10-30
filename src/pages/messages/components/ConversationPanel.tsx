import { Box, Button, Center } from "@mantine/core";
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
import type { MessageAdRef } from "@/types/chat.type";
import ConversationHeader from "./ConversationHeader";
import MessageComposer from "./MessageComposer";
import MessageList from "./MessageList";
import classes from "../Messages.module.css";

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

  const {
    messages,
    isLoading,
    error,
    refetch,
    loadOlder,
    hasOlder,
    isLoadingOlder,
  } = useMessages(conversationId);

  const { send, retry, discard } = useSendMessage(conversationId);

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
    if (started && ad) clearAd();
    return started;
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
      <ConversationHeader conversation={conversation} />

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

      <MessageComposer onSend={handleSend} ad={ad} onRemoveAd={clearAd} />
    </>
  );
};

export default ConversationPanel;
