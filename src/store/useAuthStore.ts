import type { AuthState } from "@/types/auth.type";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useFavoriteAdsStore } from "./useFavoriteStore";
import { queryClient } from "@/api/queryClient";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, userToken) => {
        set({ user: userData, token: userToken, isAuthenticated: true });
        useFavoriteAdsStore.getState().syncFavorites();
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        useFavoriteAdsStore.getState().clearFavorites();
        queryClient.clear();
      },

      setUpdatedUser: (updatedData) => {
        set({ user: updatedData });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
