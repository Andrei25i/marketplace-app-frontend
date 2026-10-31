import { refreshSession } from "@/api/session";
import { invalidateChat } from "@/hooks/chat/chatCache";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "@/types/socket.type";
import { notifications } from "@mantine/notifications";
import { io, type Socket } from "socket.io-client";

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

const MAX_RECOVERY_ATTEMPTS = 3;
const SERVER_UNAVAILABLE_RETRY_MS = 10_000;

const resolveEndpoint = () => {
  const base = new URL(
    import.meta.env.VITE_API_BASE_URL,
    window.location.origin,
  );
  return {
    url: base.origin,
    path: `${base.pathname.replace(/\/$/, "")}/socket.io`,
  };
};

const { url, path } = resolveEndpoint();

export const socket: ChatSocket = io(url, {
  path,
  withCredentials: true,
  autoConnect: false,
  reconnectionDelayMax: 10_000,
});

let recoveryAttempts = 0;
let isRecovering = false;
let hasConnectedBefore = false;

const recoverSession = async () => {
  if (isRecovering) return;
  if (recoveryAttempts >= MAX_RECOVERY_ATTEMPTS) return;

  isRecovering = true;
  recoveryAttempts++;

  try {
    const result = await refreshSession();
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    if (result.status === "ok") {
      useAuthStore.setState({ user: result.user, isAuthenticated: true });
      socket.connect();
    } else if (result.status === "unauthenticated") {
      useAuthStore.getState().logout();
      notifications.show({
        id: "session-expired",
        title: "Sesiune expirată",
        message:
          "Din motive de securitate, te rugăm să te autentifici din nou.",
        color: "red",
      });
    } else {
      setTimeout(() => socket.connect(), SERVER_UNAVAILABLE_RETRY_MS);
    }
  } finally {
    isRecovering = false;
  }
};

socket.on("connect", () => {
  recoveryAttempts = 0;
  if (hasConnectedBefore) invalidateChat();
  hasConnectedBefore = true;
});

socket.on("connect_error", (error) => {
  if (socket.active) return;

  if (error.message === "UNAUTHENTICATED") void recoverSession();
  else console.error("[socket] Conexiune refuzată:", error.message);
});

socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") void recoverSession();
});

export const resetSocketState = () => {
  recoveryAttempts = 0;
  hasConnectedBefore = false;
};
