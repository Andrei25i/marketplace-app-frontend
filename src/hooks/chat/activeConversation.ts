let readingConversationId: string | null = null;

export const setReadingConversation = (conversationId: string | null) => {
  readingConversationId = conversationId;
};

export const isReadingConversation = (conversationId: string) =>
  readingConversationId === conversationId;
