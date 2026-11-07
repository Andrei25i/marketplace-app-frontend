import { useState } from "react";
import {
  Alert,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconTrash } from "@tabler/icons-react";

import { authService } from "@/services/auth.service";
import { useFormErrors } from "@/hooks/forms/useFormErrors";

const FIELDS = ["password"] as const;

type DeleteAccountModalProps = {
  opened: boolean;
  onClose: () => void;
  onDeleted: () => void;
};

const DeleteAccountModal = ({
  opened,
  onClose,
  onDeleted,
}: DeleteAccountModalProps) => {
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    formRef,
    fieldErrors,
    generalError,
    resetErrors,
    handleRequestError,
    bindField,
  } = useFormErrors(FIELDS);
  const changePassword = bindField(setPassword, "password");

  const resetForm = () => {
    setPassword("");
    resetErrors();
  };

  const handleClose = () => {
    if (isDeleting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleDeleteAccount = async () => {
    resetErrors();
    setIsDeleting(true);

    try {
      await authService.deleteAccount(password);

      notifications.show({
        title: "Cont șters",
        message: "Contul a fost șters cu succes.",
        color: "green",
      });

      resetForm();
      onDeleted();
    } catch (err) {
      handleRequestError(err, "Contul nu a putut fi șters. Încearcă din nou.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      title={
        <Text c="red.7" fw={700} size="lg">
          Ștergere cont
        </Text>
      }
      closeOnClickOutside={!isDeleting}
      closeOnEscape={!isDeleting}
      withCloseButton={!isDeleting}
    >
      <form
        ref={formRef}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void handleDeleteAccount();
        }}
      >
        <Stack gap="md" pt="md">
          <Text size="sm" lh={1.5}>
            Această acțiune este{" "}
            <Text component="span" fw={700} c="red.7">
              ireversibilă
            </Text>
            . Toate anunțurile, favoritele și datele asociate contului vor fi
            șterse definitiv.
          </Text>

          <Text size="sm">
            Introdu parola pentru a confirma ștergerea contului.
          </Text>

          <PasswordInput
            label="Parola"
            placeholder="Introdu parola"
            value={password}
            onChange={(event) => changePassword(event.currentTarget.value)}
            disabled={isDeleting}
            autoFocus
            withAsterisk
            error={fieldErrors.password}
          />

          {generalError && (
            <Alert
              color="red"
              icon={<IconAlertCircle size={18} />}
              title="Ștergerea contului a eșuat"
              data-form-error
            >
              {generalError}
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
              type="submit"
              color="red"
              leftSection={<IconTrash size={16} />}
              loading={isDeleting}
              disabled={!password.trim()}
            >
              Șterge
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default DeleteAccountModal;
