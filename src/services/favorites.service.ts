import { api } from "@/api/api";
import type { GetAdsFilters } from "@/types/ads.type";

export const favoritesService = {
  getAll: async (filters: GetAdsFilters = {}) => {
    const response = await api.get("/favorites", { params: filters });
    return response.data;
  },

  add: async (id: string) => {
    const response = await api.post(`/favorites/${id}`);
    return response.data;
  },

  remove: async (id: string) => {
    const response = await api.delete(`/favorites/${id}`);
    return response.data;
  },
};
