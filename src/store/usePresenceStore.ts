import type { PresenceDTO } from "@/types/socket.type";
import { create } from "zustand";

type PresenceEntry = {
  online: boolean;
  lastSeenAt: string | null;
};

type PresenceState = {
  byUser: Record<string, PresenceEntry>;
  set: (presence: PresenceDTO) => void;
  setMany: (list: PresenceDTO[]) => void;
  clear: () => void;
};

export const usePresenceStore = create<PresenceState>()((set) => ({
  byUser: {},

  set: ({ userId, online, lastSeenAt }) =>
    set((state) => ({
      byUser: {
        ...state.byUser,
        [userId]: {
          online,
          lastSeenAt: lastSeenAt ?? state.byUser[userId]?.lastSeenAt ?? null,
        },
      },
    })),

  setMany: (list) =>
    set((state) => {
      const byUser = { ...state.byUser };
      for (const { userId, online, lastSeenAt } of list) {
        byUser[userId] = { online, lastSeenAt };
      }
      return { byUser };
    }),

  clear: () => set({ byUser: {} }),
}));
