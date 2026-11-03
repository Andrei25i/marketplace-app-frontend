import { ActionIcon, Group, Text } from "@mantine/core";
import { IconSend, IconTrash } from "@tabler/icons-react";
import { formatDuration, MAX_VOICE_MS } from "@/utils/chat.util";
import classes from "@/pages/messages/Messages.module.css";

type VoiceRecorderBarProps = {
  elapsedMs: number;
  onCancel: () => void;
  onSend: () => void;
};

const VoiceRecorderBar = ({
  elapsedMs,
  onCancel,
  onSend,
}: VoiceRecorderBarProps) => (
  <Group gap="sm" wrap="nowrap">
    <ActionIcon
      size={36}
      radius="xl"
      variant="subtle"
      color="red"
      onClick={onCancel}
      aria-label="Anulează înregistrarea"
    >
      <IconTrash size={18} />
    </ActionIcon>

    <Group
      gap={8}
      wrap="nowrap"
      className={classes.recorderStatus}
      role="status"
      aria-label="Se înregistrează"
    >
      <span className={classes.recordingDot} />
      <Text size="sm" fw={500} style={{ fontVariantNumeric: "tabular-nums" }}>
        {formatDuration(elapsedMs)}
      </Text>
      <Text size="xs" c="dimmed">
        / {formatDuration(MAX_VOICE_MS)}
      </Text>
    </Group>

    <ActionIcon
      size={36}
      radius="xl"
      color="primary"
      onClick={onSend}
      aria-label="Trimite mesajul vocal"
    >
      <IconSend size={18} />
    </ActionIcon>
  </Group>
);

export default VoiceRecorderBar;
