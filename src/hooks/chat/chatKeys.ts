export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  conversation: (conversationId: string) =>
    [...chatKeys.all, "conversation", conversationId] as const,
  messages: (conversationId: string) =>
    [...chatKeys.all, "messages", conversationId] as const,
  unread: () => [...chatKeys.all, "unread"] as const,
};
