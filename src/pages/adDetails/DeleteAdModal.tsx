import { useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

type DeleteAdModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

const DeleteAdModal = ({ opened, onClose, onConfirm }: DeleteAdModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      await onConfirm();
      notifications.show({
        title: "Anunț șters",
        message: "Anunțul a fost șters cu succes.",
        color: "green",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      title={
        <Text c="red.7" fw={700} size="lg">
          Ștergere anunț
        </Text>
      }
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
      withCloseButton={!isDeleting}
    >
      <Stack gap="md" pt="md">
        <Text size="sm" lh={1.5}>
          Ești sigur că vrei să ștergi acest anunț? Această acțiune este{" "}
          <Text component="span" fw={700} c="red.7">
            ireversibilă
          </Text>
          .
        </Text>

        <Text size="sm">
          Anunțul și imaginile asociate vor fi șterse definitiv.
        </Text>

        <Group justify="flex-end" gap="sm" mt="sm">
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            disabled={isDeleting}
          >
            Anulează
          </Button>

          <Button
            type="button"
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => void handleConfirm()}
            loading={isDeleting}
          >
            Șterge
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteAdModal;
