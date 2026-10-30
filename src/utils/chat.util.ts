import type {
  ChatMessage,
  ChatUserDTO,
  DisplayStatus,
  MessageDTO,
} from "@/types/chat.type";

export const MAX_MESSAGE_LENGTH = 2000;
export const EDIT_WINDOW_MS = 15 * 60 * 1000;
export const MESSAGE_LENGTH_WARNING = 1800;

type UserId = string | number | null | undefined;
type NamedUser = Pick<ChatUserDTO, "first_name" | "last_name">;

export const createClientId = (): string => {
  if (typeof crypto.randomUUID === "function" && window.isSecureContext) {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const isOwnMessage = (
  message: Pick<MessageDTO, "sender_id">,
  userId: UserId,
): boolean => userId != null && message.sender_id === String(userId);

export const isDeletedMessage = (message: Pick<MessageDTO, "deleted_at">) =>
  message.deleted_at !== null;

export const getDisplayStatus = (message: ChatMessage): DisplayStatus => {
  if (message.local_status) return message.local_status;
  if (message.read_at) return "read";
  if (message.delivered_at) return "delivered";
  return "sent";
};

export const canEditMessage = (
  message: ChatMessage,
  userId: UserId,
  now: number = Date.now(),
): boolean =>
  isOwnMessage(message, userId) &&
  !isDeletedMessage(message) &&
  !message.local_status &&
  now - new Date(message.created_at).getTime() < EDIT_WINDOW_MS;

export const canDeleteMessage = (message: ChatMessage, userId: UserId) =>
  isOwnMessage(message, userId) &&
  !isDeletedMessage(message) &&
  !message.local_status;

export const getFullName = (user: NamedUser): string =>
  `${user.first_name} ${user.last_name}`.trim();

export const getInitials = (user: NamedUser): string =>
  `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

export const getMessagePreview = (
  message: MessageDTO | null,
  userId: UserId,
): string => {
  if (!message) return "";
  if (isDeletedMessage(message)) return "Mesaj șters";

  const text = (message.content ?? "").replace(/\s+/g, " ").trim();
  return isOwnMessage(message, userId) ? `Tu: ${text}` : text;
};

export const formatUnreadCount = (count: number): string => {
  if (count > 99) {
    return "99+";
  }

  return String(count);
};
