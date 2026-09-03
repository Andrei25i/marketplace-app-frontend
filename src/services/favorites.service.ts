import { api } from "@/api/api";
import type { GetAdsFilters } from "@/types/ads.type";
import type {
  AddFavoriteResponse,
  FavoriteAdDTO,
  RemoveFavoriteResponse,
} from "@/types/favorite.types";

export const favoritesService = {
  getAll: async (filters: GetAdsFilters = {}): Promise<FavoriteAdDTO[]> => {
    const response = await api.get<FavoriteAdDTO[]>("/favorites", {
      params: filters,
    });
    return response.data;
  },

  add: async (id: string): Promise<AddFavoriteResponse> => {
    const response = await api.post<AddFavoriteResponse>(`/favorites/${id}`);
    return response.data;
  },

  remove: async (id: string): Promise<RemoveFavoriteResponse> => {
    const response = await api.delete<RemoveFavoriteResponse>(
      `/favorites/${id}`,
    );
    return response.data;
  },
};
