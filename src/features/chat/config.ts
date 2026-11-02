// Limits that protect your bill and your server. Change them in one place.
export const CHAT_LIMITS = {
  /** Max messages the client may send in one request */
  maxMessagesInRequest: 50,
  /** Only the most recent messages are sent to the model */
  maxMessagesToModel: 20,
  /** Max characters in a single message */
  maxMessageChars: 2000,
  /** Max request body size in bytes */
  maxBodyBytes: 64 * 1024,
  /** Max tokens the model may write per answer */
  maxOutputTokens: 300,
} as const;

export const SUGGESTIONS = [
  "How long does shipping take?",
  "Can I return an item?",
  "When is support online?",
];
