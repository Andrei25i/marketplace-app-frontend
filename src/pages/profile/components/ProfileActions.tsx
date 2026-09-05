import { useAuthStore } from "@/store/useAuthStore";
import { Button, Stack } from "@mantine/core";
import { IconEdit, IconLogout, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "./DeleteAccountModal";

const ProfileActions = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleAccountDeleted = () => {
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Stack gap="sm" maw={190} mx="auto" w="100%">
        <Button
          fullWidth
          color="primary"
          leftSection={<IconEdit size={16} />}
          onClick={() => navigate("/profile/edit")}
        >
          Editează profilul
        </Button>

        <Button
          fullWidth
          variant="default"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
        >
          Sign out
        </Button>

        <Button
          fullWidth
          color="red"
          variant="light"
          leftSection={<IconTrash size={16} />}
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Șterge contul
        </Button>
      </Stack>

      <DeleteAccountModal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleAccountDeleted}
      />
    </>
  );
};

export default ProfileActions;
