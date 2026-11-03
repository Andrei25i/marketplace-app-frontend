import { Box, Group, Text } from "@mantine/core";
import type { ChatActivity } from "@/types/socket.type";
import classes from "../Messages.module.css";
import { IconMicrophone } from "@tabler/icons-react";

type TypingBubbleProps = {
  kind?: ChatActivity;
};

const TypingBubble = ({ kind = "typing" }: TypingBubbleProps) => {
  const isRecording = kind === "recording";

  return (
    <Group justify="flex-start" mt="xs">
      <Box
        className={`${classes.bubble} ${classes.typingBubble}`}
        data-tail
        role="status"
        aria-label={
          isRecording ? "Înregistrează un mesaj vocal" : "Scrie un mesaj"
        }
      >
        {isRecording ? (
          <Group gap={6} wrap="nowrap">
            <IconMicrophone size={14} className={classes.recordingIcon} />
            <Text size="xs" c="dimmed" lh={1}>
              înregistrează...
            </Text>
          </Group>
        ) : (
          <span className={classes.typingDots}>
            <span />
            <span />
            <span />
          </span>
        )}
      </Box>
    </Group>
  );
};

export default TypingBubble;
