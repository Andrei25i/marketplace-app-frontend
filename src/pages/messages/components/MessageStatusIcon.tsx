import type { DisplayStatus } from "@/types/chat.type";
import {
  IconAlertCircle,
  IconCheck,
  IconChecks,
  IconClock,
} from "@tabler/icons-react";

type MessageStatusIconProps = {
  status: DisplayStatus;
  size?: number;
  onPrimary?: boolean;
};

const MessageStatusIcon = ({
  status,
  size = 16,
  onPrimary = false,
}: MessageStatusIconProps) => {
  const muted = onPrimary
    ? "rgba(255, 255, 255, 0.75)"
    : "var(--mantine-color-gray-5)";
  const read = onPrimary
    ? "var(--mantine-color-cyan-2)"
    : "var(--mantine-color-blue-5)";

  switch (status) {
    case "sending":
      return <IconClock size={size} color={muted} aria-label="Se trimite" />;
    case "failed":
      return (
        <IconAlertCircle
          size={size}
          color="var(--mantine-color-red-5)"
          aria-label="Netrimis"
        />
      );
    case "sent":
      return <IconCheck size={size} color={muted} aria-label="Trimis" />;
    case "delivered":
      return <IconChecks size={size} color={muted} aria-label="Livrat" />;
    case "read":
      return <IconChecks size={size} color={read} aria-label="Văzut" />;
  }
};

export default MessageStatusIcon;
