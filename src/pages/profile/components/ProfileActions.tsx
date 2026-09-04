import { useAuthStore } from "@/store/useAuthStore";
import { Button, Stack } from "@mantine/core";
import { IconEdit, IconLogout, IconTrash } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const ProfileActions = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
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
      >
        Șterge contul
      </Button>
    </Stack>
  );
};

export default ProfileActions;
