import {
  Box,
  Divider,
  Group,
  HoverCard,
  Popover,
  Stack,
  Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconCheck,
  IconChecks,
  IconClock,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import type { ReactElement, ReactNode } from "react";
import type { ChatMessage } from "@/types/chat.type";
import {
  formatDayLabel,
  formatDetailTime,
  formatMessageTime,
} from "@/utils/chatTime.util";

type DetailRow = {
  label: string;
  time?: string;
  icon: ReactNode;
};

const ICON_SIZE = 14;

const buildRows = (message: ChatMessage, isOwn: boolean): DetailRow[] => {
  if (message.local_status === "sending") {
    return [{ label: "Se trimite...", icon: <IconClock size={ICON_SIZE} /> }];
  }
  if (message.local_status === "failed") {
    return [
      {
        label: "Nu a fost trimis",
        icon: (
          <IconAlertCircle
            size={ICON_SIZE}
            color="var(--mantine-color-red-6)"
          />
        ),
      },
    ];
  }

  const created = message.created_at;
  const at = (iso: string) => formatDetailTime(iso, created);

  const rows: DetailRow[] = [
    {
      label: "Trimis",
      time: formatMessageTime(created),
      icon: <IconCheck size={ICON_SIZE} />,
    },
  ];

  if (isOwn && message.delivered_at) {
    rows.push({
      label: "Livrat",
      time: at(message.delivered_at),
      icon: <IconChecks size={ICON_SIZE} />,
    });
  }
  if (isOwn && message.read_at) {
    rows.push({
      label: "Văzut",
      time: at(message.read_at),
      icon: <IconChecks size={ICON_SIZE} color="var(--mantine-color-blue-5)" />,
    });
  }
  if (message.edited_at) {
    rows.push({
      label: "Editat",
      time: at(message.edited_at),
      icon: <IconPencil size={ICON_SIZE} />,
    });
  }
  if (message.deleted_at) {
    rows.push({
      label: "Șters",
      time: at(message.deleted_at),
      icon: <IconTrash size={ICON_SIZE} />,
    });
  }

  return rows;
};

const DetailsContent = ({
  message,
  isOwn,
}: {
  message: ChatMessage;
  isOwn: boolean;
}) => {
  const rows = buildRows(message, isOwn);
  const isLocal = Boolean(message.local_status);

  return (
    <Stack gap={6} miw={160}>
      {!isLocal && (
        <>
          <Text size="xs" fw={600}>
            {formatDayLabel(message.created_at)}
          </Text>
          <Divider />
        </>
      )}

      {rows.map((row) => (
        <Group key={row.label} justify="space-between" gap="lg" wrap="nowrap">
          <Group gap={8} wrap="nowrap">
            <Box c="dimmed" display="flex">
              {row.icon}
            </Box>
            <Text size="xs" c="dimmed">
              {row.label}
            </Text>
          </Group>
          {row.time && (
            <Text size="xs" fw={500}>
              {row.time}
            </Text>
          )}
        </Group>
      ))}
    </Stack>
  );
};

type MessageTimeDetailsProps = {
  message: ChatMessage;
  isOwn: boolean;
  position: "left" | "right";
  children: ReactElement;
};

const MessageTimeDetails = ({
  message,
  isOwn,
  position,
  children,
}: MessageTimeDetailsProps) => {
  const isTouch = useMediaQuery("(hover: none)", false, {
    getInitialValueInEffect: false,
  });

  const content = <DetailsContent message={message} isOwn={isOwn} />;

  if (isTouch) {
    return (
      <Popover position="top" withArrow shadow="md" radius="md">
        <Popover.Target>{children}</Popover.Target>
        <Popover.Dropdown px="sm" py="xs">
          {content}
        </Popover.Dropdown>
      </Popover>
    );
  }

  return (
    <HoverCard
      position={position}
      openDelay={300}
      closeDelay={100}
      withArrow
      shadow="md"
      radius="md"
    >
      <HoverCard.Target>{children}</HoverCard.Target>
      <HoverCard.Dropdown px="sm" py="xs">
        {content}
      </HoverCard.Dropdown>
    </HoverCard>
  );
};

export default MessageTimeDetails;
