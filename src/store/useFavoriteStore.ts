import { favoritesService } from "@/services/favorites.service";
import type { FavoriteAdsState } from "@/types/favorite.types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const readAuthToken = () => {
  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
};

export const useFavoriteAdsStore = create<FavoriteAdsState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      isLoaded: false,

      isFavorite: (adId) => get().favoriteIds.includes(adId),

      syncFavorites: async () => {
        const token = readAuthToken();

        if (!token) {
          set({ favoriteIds: [], isLoaded: true });
          return;
        }

        try {
          const ads = await favoritesService.getAll();
          const ids = Array.isArray(ads) ? ads.map((ad) => ad.id) : [];

          set({ favoriteIds: ids, isLoaded: true });
        } catch (error) {
          console.error("Eroare la sincronizarea favoritelor:", error);
          set({ isLoaded: true });
        }
      },

      toggleFavorite: async (adId: string) => {
        const previous = get().favoriteIds;
        const isCurrentlyFavorite = previous.includes(adId);

        set({
          favoriteIds: isCurrentlyFavorite
            ? previous.filter((id) => id !== adId)
            : [...new Set([...previous, adId])],
        });

        try {
          if (isCurrentlyFavorite) {
            await favoritesService.remove(adId);
          } else {
            await favoritesService.add(adId);
          }

          await get().syncFavorites();

          return !isCurrentlyFavorite;
        } catch (error) {
          set({ favoriteIds: previous });
          throw error;
        }
      },

      clearFavorites: () => set({ favoriteIds: [], isLoaded: true }),
    }),
    {
      name: "favorite-ads-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
