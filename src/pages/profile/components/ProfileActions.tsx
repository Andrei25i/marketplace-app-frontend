import { ActionIcon, Menu } from "@mantine/core";
import {
  IconDevices,
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

const ProfileActions = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login", { replace: true });
  };

  const handleAccountDeleted = () => {
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Menu position="bottom-end" shadow="md" width={220} withinPortal>
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
            leftSection={<IconKey size={16} />}
            onClick={() => navigate("/profile/password")}
          >
            Schimbă parola
          </Menu.Item>

          <Menu.Item
            leftSection={<IconDevices size={16} />}
            onClick={() => navigate("/profile/sessions")}
          >
            Sesiuni active
          </Menu.Item>

          <Menu.Item
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Sign out
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
