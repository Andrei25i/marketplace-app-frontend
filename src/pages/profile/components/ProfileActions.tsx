import { useAuthStore } from "@/store/useAuthStore";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconKey,
  IconLogout,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "./DeleteAccountModal";
import { authService } from "@/services/auth.service";
import { notifications } from "@mantine/notifications";
import { getErrorMessage } from "@/utils/getErrorMessage.util";

const ProfileActions = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleChangePassword = async () => {
    if (!user?.email || isSendingReset) return;

    setIsSendingReset(true);

    try {
      await authService.forgotPassword(user.email);

      notifications.show({
        title: "Email trimis",
        message: `Vei primi pe adresa de email asociata contului un link pentru schimbarea parolei.`,
        color: "green",
        autoClose: 8000,
      });
    } catch (err) {
      notifications.show({
        title: "Eroare",
        message: getErrorMessage(
          err,
          "Emailul nu a putut fi trimis. Încearcă din nou.",
        ),
        color: "red",
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleAccountDeleted = () => {
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Menu position="bottom-end" shadow="md" width={200} withinPortal>
        <Menu.Target>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="xl"
            aria-label="Acțiuni profil"
          >
            <IconDotsVertical size={20} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEdit size={16} />}
            onClick={() => navigate("/profile/edit")}
          >
            Editează profilul
          </Menu.Item>

          <Menu.Item
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Sign out
          </Menu.Item>

          <Menu.Item
            leftSection={<IconKey size={16} />}
            onClick={handleChangePassword}
            disabled={isSendingReset}
          >
            Schimbă parola
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Șterge contul
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <DeleteAccountModal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={handleAccountDeleted}
      />
    </>
  );
};

export default ProfileActions;
