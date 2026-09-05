import { useState } from "react";
import { Alert, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

type DeleteAdModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

const DeleteAdModal = ({ opened, onClose, onConfirm }: DeleteAdModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    setIsDeleting(true);

    try {
      await onConfirm();

      notifications.show({
        title: "Anunț șters",
        message: "Anunțul a fost șters cu succes.",
        color: "green",
      });
    } catch (err) {
      setError(
        getErrorMessage(err, "Anunțul nu a putut fi șters. Încearcă din nou."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    setError("");
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
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

        {error && (
          <Alert
            color="red"
            icon={<IconAlertCircle size={18} />}
            title="Ștergerea anunțului a eșuat"
          >
            {error}
          </Alert>
        )}

        <Group justify="flex-end" gap="sm" mt="sm">
          <Button
            type="button"
            variant="default"
            onClick={handleClose}
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
