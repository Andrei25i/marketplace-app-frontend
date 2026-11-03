import type {
  ChatMessage,
  MessageAdRef,
  VoiceRecording,
} from "@/types/chat.type";
import classes from "@/pages/messages/Messages.module.css";
import { type ClipboardEvent, type KeyboardEvent } from "react";
import {
  MAX_ATTACHMENTS,
  MAX_MESSAGE_LENGTH,
  MESSAGE_LENGTH_WARNING,
} from "@/utils/chat.util";
import { ActionIcon, Box, Group, Text, Textarea } from "@mantine/core";
import { IconCheck, IconMicrophone, IconSend } from "@tabler/icons-react";
import useEditDraft from "./useEditDraft";
import useComposerImages from "./useComposerImages";
import EditBanner from "./EditBanner";
import AdBadge from "./AdBadge";
import ComposerImageStrip from "./ComposerImageStrip";
import AttachImageButton from "./AttachImageButton";
import useVoiceRecorder from "./useVoiceRecorder";
import { notifications } from "@mantine/notifications";
import VoiceRecorderBar from "./VoiceRecorderBar";

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
  onSendVoice: (voice: VoiceRecording) => boolean;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
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
  onSendVoice,
  onRecordingStart,
  onRecordingStop,
}: MessageComposerProps) => {
  const { value, setValue, textareaRef } = useEditDraft(editing);
  const { images, addFiles, removeImage, clearImages } = useComposerImages(() =>
    textareaRef.current?.focus(),
  );

  const sendRecording = (voice: VoiceRecording | null) => {
    if (!voice) {
      notifications.show({
        color: "yellow",
        message: "Mesajul vocal este prea scurt. Ține cel puțin o secundă.",
      });
      return;
    }
    onSendVoice(voice);
  };

  const recorder = useVoiceRecorder((voice) => {
    onRecordingStop();
    sendRecording(voice);
  });
  const isRecording = recorder.status === "recording";

  const length = value.trim().length;
  const isTooLong = length > MAX_MESSAGE_LENGTH;
  const hasImages = images.length > 0 && !editing;
  const canSend = editing
    ? !isTooLong && (length > 0 || editing.attachments.length > 0)
    : !isTooLong && (length > 0 || hasImages);

  const showMic = !editing && length === 0 && !hasImages;

  const startRecording = async () => {
    if (await recorder.start()) onRecordingStart();
  };

  const finishRecording = async () => {
    onRecordingStop();
    sendRecording(await recorder.stop());
  };

  const cancelRecording = () => {
    recorder.cancel();
    onRecordingStop();
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

  return (
    <Box className={classes.composer} px="md" py="sm">
      {editing && (
        <EditBanner content={editing.content} onCancel={onCancelEdit} />
      )}
      {ad && !editing && <AdBadge title={ad.title} onRemove={onRemoveAd} />}
      {hasImages && (
        <ComposerImageStrip
          images={images}
          onRemove={removeImage}
          onClear={clearImages}
        />
      )}

      {isRecording ? (
        <VoiceRecorderBar
          elapsedMs={recorder.elapsedMs}
          onCancel={cancelRecording}
          onSend={() => void finishRecording()}
        />
      ) : (
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
            leftSection={
              editing ? undefined : (
                <AttachImageButton
                  disabled={images.length >= MAX_ATTACHMENTS}
                  onFiles={addFiles}
                />
              )
            }
            leftSectionWidth={40}
            leftSectionPointerEvents="all"
            leftSectionProps={{
              style: { alignItems: "flex-end", paddingBottom: 3 },
            }}
            style={{ flex: 1 }}
          />

          {showMic ? (
            <ActionIcon
              size={36}
              radius="xl"
              color="primary"
              onClick={() => void startRecording()}
              loading={recorder.status === "starting"}
              aria-label="Înregistrează un mesaj vocal"
            >
              <IconMicrophone size={18} />
            </ActionIcon>
          ) : (
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
          )}
        </Group>
      )}

      {length >= MESSAGE_LENGTH_WARNING && (
        <Text size="xs" c={isTooLong ? "red" : "dimmed"} ta="right" mt={4}>
          {length}/{MAX_MESSAGE_LENGTH}
        </Text>
      )}
    </Box>
  );
};

export default MessageComposer;
