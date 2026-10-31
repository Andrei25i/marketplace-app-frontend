import type { ConversationSummaryDTO } from "@/types/chat.type";
import { formatLastSeen } from "@/utils/chatTime.util";
import {
  ActionIcon,
  Box,
  Group,
  Skeleton,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useEffect, useState, type ReactNode } from "react";
import classes from "../Messages.module.css";
import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import ChatAvatar from "./ChatAvatar";
import { getFullName } from "@/utils/chat.util";
import usePresence from "@/hooks/chat/usePresence";

type ConversationHeaderProps = {
  conversation: ConversationSummaryDTO | null;
  actions?: ReactNode;
};

const ConversationHeader = ({
  conversation,
  actions,
}: ConversationHeaderProps) => {
  const otherUser = conversation?.other_user;
  const presence = usePresence(otherUser);
  const lastSeen = presence ? formatLastSeen(presence) : "";

  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((tick) => tick + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Group
      px="md"
      h={64}
      wrap="nowrap"
      justify="space-between"
      className={classes.panelHeader}
    >
      <Group wrap="nowrap" gap="sm" style={{ minWidth: 0 }}>
        <ActionIcon
          component={Link}
          to="/messages"
          replace
          hiddenFrom="sm"
          variant="subtle"
          color="gray"
          size="lg"
          aria-label="Înapoi la conversații"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>

        {otherUser ? (
          <UnstyledButton
            component={Link}
            to={`/user/${otherUser.id}`}
            style={{ minWidth: 0 }}
          >
            <Group wrap="nowrap" gap="sm">
              <ChatAvatar user={otherUser} size={40} />
              <Box style={{ minWidth: 0 }}>
                <Text fw={600} truncate>
                  {getFullName(otherUser)}
                </Text>
                {lastSeen && (
                  <Text size="xs" c={presence?.is_online ? "green" : "dimmed"}>
                    {lastSeen}
                  </Text>
                )}
              </Box>
            </Group>
          </UnstyledButton>
        ) : (
          <Group wrap="nowrap" gap="sm">
            <Skeleton circle height={40} />
            <Skeleton height={14} width={140} radius="sm" />
          </Group>
        )}
      </Group>

      {actions}
    </Group>
  );
};

export default ConversationHeader;
