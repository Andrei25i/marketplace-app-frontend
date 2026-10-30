export type MessageStatus = "sent" | "delivered" | "read";
export type LocalMessageStatus = "sending" | "failed";
export type DisplayStatus = LocalMessageStatus | MessageStatus;

export interface MessageAdRef {
  id: string;
  title: string;
}

export interface MessageDTO {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  client_id: string | null;
  ad: MessageAdRef | null;
  status: MessageStatus;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
}

export interface ChatMessage extends MessageDTO {
  local_status?: LocalMessageStatus;
}

export interface ChatUserDTO {
  id: string;
  first_name: string;
  last_name: string;
  is_online: boolean;
  last_seen_at: string | null;
}

export interface ConversationSummaryDTO {
  id: string;
  other_user: ChatUserDTO;
  last_message: MessageDTO | null;
  unread_count: number;
  last_message_at: string | null;
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

export interface SendMessagePayload {
  content: string;
  clientId: string;
  adId?: string | null;
}

export interface MarkReadResponse {
  readAt: string | null;
  count: number;
}

export interface UnreadCountResponse {
  total: number;
}

export interface ConversationReadPayload {
  conversationId: string;
  readerId: string;
  readAt: string;
  upTo: string;
}

export interface MessagesDeliveredPayload {
  conversationId: string;
  messageIds: string[];
  deliveredAt: string;
}
