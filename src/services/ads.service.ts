import { api } from "@/api/api";
import type { CreateAdDTO, GetAdsFilters, UpdateAdDTO } from "@/types/ads.type";

export const adsService = {
  getAll: async (filters: GetAdsFilters = {}) => {
    const response = await api.get("/ads", { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/ads${id}`);
    return response.data;
  },

  create: async (data: CreateAdDTO) => {
    const response = await api.post("/ads", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAdDTO) => {
    const response = await api.put(`/ads/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  },
};
