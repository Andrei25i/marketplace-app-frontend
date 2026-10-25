import type { AuthState, User } from "@/types/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useFavoriteAdsStore } from "./useFavoriteStore";
import { queryClient } from "@/api/queryClient";
import { postAuthMessage } from "@/auth/authChannel";

type PersistedAuth = { user: User | null };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (user, { broadcast = true } = {}) => {
        set({ user, isAuthenticated: true });
        void useFavoriteAdsStore.getState().syncFavorites();
        if (broadcast) postAuthMessage({ type: "login", user });
      },

      logout: ({ broadcast = true } = {}) => {
        set({ user: null, isAuthenticated: false });
        useFavoriteAdsStore.getState().clearFavorites();
        queryClient.clear();
        if (broadcast) postAuthMessage({ type: "logout" });
      },

      setUpdatedUser: (user, { broadcast = true } = {}) => {
        set({ user, isAuthenticated: true });
        if (broadcast) postAuthMessage({ type: "user-updated", user });
      },
    }),
    {
      name: "auth-storage",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): PersistedAuth => ({ user: state.user }),
      migrate: (persisted): PersistedAuth => ({
        user: (persisted as Partial<PersistedAuth> | null)?.user ?? null,
      }),
      merge: (persisted, current) => {
        const user =
          (persisted as Partial<PersistedAuth> | undefined)?.user ?? null;
        return { ...current, user, isAuthenticated: user !== null };
      },
    },
  ),
);
