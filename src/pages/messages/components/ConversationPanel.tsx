import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import useConversation from "@/hooks/chat/useConversation";
import { Center } from "@mantine/core";
import ConversationHeader from "./ConversationHeader";
import classes from "../Messages.module.css";
import { Text } from "@mantine/core";

type ConversationPanelProps = {
  conversationId: string;
};

const ConversationPanel = ({ conversationId }: ConversationPanelProps) => {
  const { conversation, error, refetch } = useConversation(conversationId);

  if (error && !conversation) {
    return (
      <Center h="100%" p="md">
        <RequestErrorAlert
          title="Conversație indisponibilă"
          message={error}
          onRetry={refetch}
        />
      </Center>
    );
  }

  return (
    <>
      <ConversationHeader conversation={conversation} />

      <Center className={classes.panelBody}>
        <Text size="sm" c="dimmed">
          Mesajele vor apărea aici.
        </Text>
      </Center>
    </>
  );
};

export default ConversationPanel;
