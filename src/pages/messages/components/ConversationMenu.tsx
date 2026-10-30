import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconTrash, IconUser } from "@tabler/icons-react";
import { Link } from "react-router-dom";

type ConversationMenuProps = {
  otherUserId: string;
  onHide: () => void;
};

const ConversationMenu = ({ otherUserId, onHide }: ConversationMenuProps) => (
  <Menu position="bottom-end" shadow="md" radius="md">
    <Menu.Target>
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        radius="md"
        aria-label="Opțiuni conversație"
      >
        <IconDotsVertical size={20} />
      </ActionIcon>
    </Menu.Target>

    <Menu.Dropdown>
      <Menu.Item
        component={Link}
        to={`/user/${otherUserId}`}
        leftSection={<IconUser size={16} />}
      >
        Vezi profilul
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        color="red"
        leftSection={<IconTrash size={16} />}
        onClick={onHide}
      >
        Șterge conversația
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
);

export default ConversationMenu;
