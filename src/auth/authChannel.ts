import type { User } from "@/types/auth.type";

export type AuthMessage =
  | { type: "login"; user: User }
  | { type: "logout" }
  | { type: "user-updated"; user: User };

const channel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("auth") : null;

export const postAuthMessage = (message: AuthMessage) => {
  channel?.postMessage(message);
};

export const subscribeAuthMessages = (
  handler: (message: AuthMessage) => void,
) => {
  if (!channel) return () => {};

  const listener = (event: MessageEvent<AuthMessage>) => handler(event.data);
  channel.addEventListener("message", listener);

  return () => channel.removeEventListener("message", listener);
};
