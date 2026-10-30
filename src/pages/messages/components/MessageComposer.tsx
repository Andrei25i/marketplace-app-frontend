import type { MessageAdRef } from "@/types/chat.type";
import classes from "../Messages.module.css";
import { useRef, useState, type KeyboardEvent } from "react";
import { MAX_MESSAGE_LENGTH, MESSAGE_LENGTH_WARNING } from "@/utils/chat.util";
import {
  ActionIcon,
  Badge,
  Box,
  CloseButton,
  Group,
  Text,
  Textarea,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";

type MessageComposerProps = {
  onSend: (content: string) => boolean;
  ad: MessageAdRef | null;
  onRemoveAd: () => void;
};

const MessageComposer = ({ onSend, ad, onRemoveAd }: MessageComposerProps) => {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const length = value.trim().length;
  const isTooLong = length > MAX_MESSAGE_LENGTH;
  const canSend = length > 0 && !isTooLong;

  const submit = () => {
    if (!canSend) return;

    if (onSend(value)) {
      setValue("");
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <Box className={classes.composer} px="md" py="sm">
      {ad && (
        <Group mb="xs">
          <Badge
            variant="light"
            color="primary"
            tt="none"
            maw="100%"
            rightSection={
              <CloseButton
                size="xs"
                onClick={onRemoveAd}
                aria-label="Elimină anunțul"
              />
            }
          >
            Despre: {ad.title}
          </Badge>
        </Group>
      )}

      <Group align="flex-end" gap="sm" wrap="nowrap">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrie un mesaj..."
          aria-label="Mesaj"
          autosize
          minRows={1}
          maxRows={5}
          error={isTooLong}
          style={{ flex: 1 }}
        />

        <ActionIcon
          size={36}
          radius="xl"
          color="primary"
          onClick={submit}
          disabled={!canSend}
          aria-label="Trimite mesajul"
        >
          <IconSend size={18} />
        </ActionIcon>
      </Group>

      {length >= MESSAGE_LENGTH_WARNING && (
        <Text size="xs" c={isTooLong ? "red" : "dimmed"} ta="right" mt={4}>
          {length}/{MAX_MESSAGE_LENGTH}
        </Text>
      )}
    </Box>
  );
};

export default MessageComposer;
