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
import type { ReactNode } from "react";
import classes from "../Messages.module.css";
import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import ChatAvatar from "./ChatAvatar";
import { getFullName } from "@/utils/chat.util";

type ConversationHeaderProps = {
  conversation: ConversationSummaryDTO | null;
  actions?: ReactNode;
};

const ConversationHeader = ({
  conversation,
  actions,
}: ConversationHeaderProps) => {
  const otherUser = conversation?.other_user;
  const lastSeen = otherUser ? formatLastSeen(otherUser) : "";

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
          variant="subtle"
          color="gray"
          size="lg"
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
                  <Text size="xs" c={otherUser.is_online ? "green" : "dimmed"}>
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
