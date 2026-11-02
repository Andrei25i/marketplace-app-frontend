import type { ChatMessage, MessageAdRef } from "@/types/chat.type";
import classes from "../Messages.module.css";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_ATTACHMENTS,
  MAX_MESSAGE_LENGTH,
  MESSAGE_LENGTH_WARNING,
  pickImageFiles,
} from "@/utils/chat.util";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  CloseButton,
  Group,
  ScrollArea,
  Text,
  Textarea,
  Tooltip,
} from "@mantine/core";
import {
  IconCheck,
  IconPencil,
  IconPhoto,
  IconSend,
  IconTrash,
} from "@tabler/icons-react";
import useImageLightbox from "@/components/ui/images/useImageLightbox";
import { notifications } from "@mantine/notifications";
import ImageTile from "@/components/ui/images/ImageTile";
import ImageLightbox from "@/components/ui/images/ImageLightbox";

type PendingImage = { file: File; preview: string };

type MessageComposerProps = {
  onSend: (content: string, files: File[]) => boolean;
  ad: MessageAdRef | null;
  onRemoveAd: () => void;
  editing: ChatMessage | null;
  isSavingEdit: boolean;
  onSaveEdit: (content: string) => void;
  onCancelEdit: () => void;
  onTyping: () => void;
  onTypingStop: () => void;
};

const MessageComposer = ({
  onSend,
  ad,
  onRemoveAd,
  editing,
  isSavingEdit,
  onSaveEdit,
  onCancelEdit,
  onTyping,
  onTypingStop,
}: MessageComposerProps) => {
  const [value, setValue] = useState("");
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [images, setImages] = useState<PendingImage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lightbox = useImageLightbox();

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

  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(
    () => () =>
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview)),
    [],
  );

  const length = value.trim().length;
  const isTooLong = length > MAX_MESSAGE_LENGTH;
  const hasImages = images.length > 0 && !editing;
  const canSend = editing
    ? !isTooLong && (length > 0 || editing.attachments.length > 0)
    : !isTooLong && (length > 0 || hasImages);

  const addFiles = (incoming: File[]) => {
    if (incoming.length === 0) return;

    const { accepted, problems } = pickImageFiles(incoming, images.length);
    if (problems.length > 0) {
      notifications.show({
        color: "red",
        title: "Unele imagini nu au fost adăugate",
        message: problems.join(" "),
      });
    }
    if (accepted.length === 0) return;

    setImages((prev) => [
      ...prev,
      ...accepted.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    textareaRef.current?.focus();
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    setImages(images.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.preview));
    setImages([]);
  };

  const submit = () => {
    if (!canSend) return;

    if (editing) {
      if (value.trim() === (editing.content ?? "").trim()) onCancelEdit();
      else onSaveEdit(value);
      return;
    }

    if (
      onSend(
        value,
        images.map((image) => image.file),
      )
    ) {
      setValue("");
      clearImages();
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

  const handlePaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (editing) return;
    const files = Array.from(event.clipboardData.files);
    if (files.length === 0) return;
    event.preventDefault();
    addFiles(files);
  };

  const attachButton = (
    <Tooltip label="Atașează imagini" openDelay={400}>
      <ActionIcon
        size={28}
        radius="xl"
        variant="subtle"
        color="gray"
        onClick={() => fileInputRef.current?.click()}
        disabled={images.length >= MAX_ATTACHMENTS}
        aria-label="Atașează imagini"
      >
        <IconPhoto size={18} />
      </ActionIcon>
    </Tooltip>
  );

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

      {hasImages && (
        <Box mb="xs">
          <Group justify="space-between" mb={6}>
            <Text size="xs" c="dimmed">
              {images.length}/{MAX_ATTACHMENTS} imagini
            </Text>
            <Button
              size="compact-xs"
              variant="subtle"
              color="red"
              onClick={clearImages}
            >
              <IconTrash size={14} />
            </Button>
          </Group>

          <ScrollArea type="auto" scrollbarSize={6} offsetScrollbars>
            <Group gap="xs" wrap="nowrap" className={classes.composerImages}>
              {images.map((image, index) => (
                <ImageTile
                  key={image.preview}
                  src={image.preview}
                  alt={`Imaginea selectată ${index + 1}`}
                  width={64}
                  onClick={() => lightbox.open(index)}
                  onRemove={() => removeImage(index)}
                />
              ))}
            </Group>
          </ScrollArea>
        </Box>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        multiple
        hidden
        onChange={(event) => {
          addFiles(Array.from(event.currentTarget.files ?? []));
          event.currentTarget.value = "";
        }}
      />

      <Group align="flex-end" gap="sm" wrap="nowrap">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => {
            const next = event.currentTarget.value;
            setValue(next);

            if (editing) return;
            if (next.trim()) onTyping();
            else onTypingStop();
          }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={
            editing
              ? "Editează mesajul..."
              : hasImages
                ? "Adaugă o descriere..."
                : "Scrie un mesaj..."
          }
          aria-label="Mesaj"
          autosize
          minRows={1}
          maxRows={5}
          error={isTooLong}
          leftSection={editing ? undefined : attachButton}
          leftSectionWidth={40}
          leftSectionPointerEvents="all"
          leftSectionProps={{
            style: { alignItems: "flex-end", paddingBottom: 3 },
          }}
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

      <ImageLightbox
        images={images.map((image, index) => ({
          src: image.preview,
          alt: `Imaginea selectată ${index + 1}`,
        }))}
        opened={lightbox.opened}
        initialIndex={lightbox.initialIndex}
        onClose={lightbox.close}
      />
    </Box>
  );
};

export default MessageComposer;
