import type { ChatUserDTO } from "@/types/chat.type";
import { getInitials } from "@/utils/chat.util";
import { Avatar, Indicator } from "@mantine/core";

type ChatAvatarProps = {
  user: ChatUserDTO;
  size?: number;
};

const ChatAvatar = ({ user, size = 44 }: ChatAvatarProps) => {
  return (
    <Indicator
      color="green"
      size={12}
      offset={size * 0.14}
      position="bottom-end"
      withBorder
      disabled={!user.is_online}
    >
      <Avatar size={size} radius="xl" color="primary.2" c="primary.6">
        {getInitials(user)}
      </Avatar>
    </Indicator>
  );
};

export default ChatAvatar;
