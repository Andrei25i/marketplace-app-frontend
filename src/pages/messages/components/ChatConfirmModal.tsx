import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useState, type ReactNode } from "react";

type ChatConfirmModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<unknown>;
  title: string;
  confirmLabel: string;
  children: ReactNode;
};

const ChatConfirmModal = ({
  opened,
  onClose,
  onConfirm,
  title,
  confirmLabel,
  children,
}: ChatConfirmModalProps) => {
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error is shows already in notification
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = () => {
    if (!isPending) onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      title={
        <Text c="red.7" fw={700} size="lg">
          {title}
        </Text>
      }
      closeOnClickOutside={!isPending}
      closeOnEscape={!isPending}
      withCloseButton={!isPending}
    >
      <Stack gap="md" pt="xs">
        {children}

        <Group justify="flex-end" gap="sm" mt="sm">
          <Button variant="default" onClick={handleClose} disabled={isPending}>
            Anulează
          </Button>
          <Button
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => void handleConfirm()}
            loading={isPending}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ChatConfirmModal;
