import useConversations from "@/hooks/chat/useConversations";
import {
  Box,
  Button,
  Center,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import classes from "../Messages.module.css";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import { IconMessage } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import ConversationListItem from "./ConversationListItem";
import BackButton from "@/components/navigation/BackButton";
import usePresenceSubscription from "@/hooks/chat/usePresenceSubscription";

type ConversationListProps = {
  activeId?: string;
};

const ConversationList = ({ activeId }: ConversationListProps) => {
  const {
    conversations,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useConversations();

  usePresenceSubscription(conversations.map((c) => c.other_user.id));

  const isEmpty = !isLoading && !error && conversations.length === 0;

  return (
    <>
      <Group h={64} px="md" py="sm" className={classes.listHeader}>
        <BackButton mb={0} />
        <Title order={2} size="h4">
          Mesaje
        </Title>
      </Group>

      <ScrollArea className={classes.scroll} type="auto" scrollbarSize={6}>
        {isLoading && (
          <Center py="xl">
            <Loader color="primary" />
          </Center>
        )}

        {error && (
          <Box px="md">
            <RequestErrorAlert compact message={error} onRetry={refetch} />
          </Box>
        )}

        {isEmpty && (
          <Stack align="center" gap="xs" p="xl" ta="center">
            <ThemeIcon size={56}>
              <IconMessage size={28} />
            </ThemeIcon>
            <Text fw={700}>Nicio conversație încă</Text>
            <Text size="sm" c="dimmed">
              Intră pe un anunț și apasă „Trimite mesaj” ca să începi o
              conversație cu vânzătorul.
            </Text>
            <Button
              component={Link}
              to="/search"
              variant="light"
              size="xs"
              mt="xs"
            >
              Caută anunțuri
            </Button>
          </Stack>
        )}

        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            active={conversation.id === activeId}
          />
        ))}

        {hasNextPage && (
          <Center py="sm">
            <Button
              variant="subtle"
              size="xs"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Arată mai multe
            </Button>
          </Center>
        )}
      </ScrollArea>
    </>
  );
};

export default ConversationList;
