import type { ChatMessage, MessageAdRef } from "@/types/chat.type";
import classes from "../Messages.module.css";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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
import { IconCheck, IconPencil, IconSend } from "@tabler/icons-react";

type MessageComposerProps = {
  onSend: (content: string) => boolean;
  ad: MessageAdRef | null;
  onRemoveAd: () => void;
  editing: ChatMessage | null;
  isSavingEdit: boolean;
  onSaveEdit: (content: string) => void;
  onCancelEdit: () => void;
};

const MessageComposer = ({
  onSend,
  ad,
  onRemoveAd,
  editing,
  isSavingEdit,
  onSaveEdit,
  onCancelEdit,
}: MessageComposerProps) => {
  const [value, setValue] = useState("");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentEditId = editing?.id ?? null;
  if (currentEditId !== editingId) {
    setEditingId(currentEditId);

    if (editing) {
      if (editingId === null) setDraft(value);
      setValue(editing.content ?? "");
    } else {
      setValue(draft);
      setDraft("");
    }
  }

  useEffect(() => {
    if (currentEditId) textareaRef.current?.focus();
  }, [currentEditId]);

  const length = value.trim().length;
  const isTooLong = length > MAX_MESSAGE_LENGTH;
  const canSend = length > 0 && !isTooLong;

  const submit = () => {
    if (!canSend) return;

    if (editing) {
      if (value.trim() === (editing.content ?? "").trim()) onCancelEdit();
      else onSaveEdit(value);
      return;
    }

    if (onSend(value)) {
      setValue("");
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape" && editing) {
      event.preventDefault();
      onCancelEdit();
      return;
    }

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
      {editing && (
        <Group
          justify="space-between"
          wrap="nowrap"
          mb="xs"
          className={classes.editBanner}
        >
          <Box style={{ minWidth: 0 }}>
            <Group gap={4} wrap="nowrap">
              <IconPencil size={14} color="var(--mantine-color-primary-6)" />
              <Text size="xs" fw={600} c="primary">
                Editezi mesajul
              </Text>
            </Group>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {editing.content}
            </Text>
          </Box>
          <CloseButton
            size="sm"
            onClick={onCancelEdit}
            aria-label="Anulează editarea"
          />
        </Group>
      )}

      {ad && !editing && (
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
          placeholder={editing ? "Editează mesajul..." : "Scrie un mesaj..."}
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
          loading={isSavingEdit}
          aria-label={editing ? "Salvează modificarea" : "Trimite mesajul"}
        >
          {editing ? <IconCheck size={18} /> : <IconSend size={18} />}
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
