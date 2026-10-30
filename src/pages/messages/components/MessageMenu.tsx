import type { ChatMessage } from "@/types/chat.type";
import { canDeleteMessage, canEditMessage } from "@/utils/chat.util";
import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import classes from "../Messages.module.css";

type MessageMenuProps = {
  message: ChatMessage;
  userId: string | number | null | undefined;
  onEdit: (message: ChatMessage) => void;
  onDelete: (message: ChatMessage) => void;
};

const MessageMenuItems = ({
  message,
  userId,
  onEdit,
  onDelete,
}: MessageMenuProps) => {
  const canEdit = canEditMessage(message, userId);

  return (
    <>
      {canEdit && (
        <Menu.Item
          leftSection={<IconPencil size={16} />}
          onClick={() => onEdit(message)}
        >
          Editează
        </Menu.Item>
      )}
      <Menu.Item
        color="red"
        leftSection={<IconTrash size={16} />}
        onClick={() => onDelete(message)}
      >
        Șterge
      </Menu.Item>
    </>
  );
};

const MessageMenu = (props: MessageMenuProps) => {
  if (!canDeleteMessage(props.message, props.userId)) return null;

  return (
    <Menu position="bottom-end" shadow="md" radius="md">
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="sm"
          radius="xl"
          className={classes.menuTrigger}
          aria-label="Opțiuni mesaj"
        >
          <IconDotsVertical size={16} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <MessageMenuItems {...props} />
      </Menu.Dropdown>
    </Menu>
  );
};

export default MessageMenu;
