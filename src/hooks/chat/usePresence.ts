import { usePresenceStore } from "@/store/usePresenceStore";
import type { ChatUserDTO } from "@/types/chat.type";

type PresenceSource = Pick<ChatUserDTO, "id" | "is_online" | "last_seen_at">;

const usePresence = (user: PresenceSource | undefined) => {
  const live = usePresenceStore((state) =>
    user ? state.byUser[user.id] : undefined,
  );

  if (!user) return null;

  return {
    is_online: live?.online ?? user.is_online,
    last_seen_at: live?.lastSeenAt ?? user.last_seen_at,
  };
};

export default usePresence;
