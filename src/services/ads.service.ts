import { api } from "@/api/api";
import type {
  AdDetailsDTO,
  AdDTO,
  AdImage,
  CreateAdDTO,
  DeleteAdResponse,
  GetAdsFilters,
  UpdateAdDTO,
} from "@/types/ads.type";

export const adsService = {
  getAll: async (filters: GetAdsFilters = {}): Promise<AdDTO[]> => {
    const response = await api.get<AdDTO[]>("/ads", { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<AdDetailsDTO> => {
    const response = await api.get<AdDetailsDTO>(`/ads/${id}`);
    return response.data;
  },

  create: async (data: CreateAdDTO): Promise<AdDTO> => {
    const response = await api.post<AdDTO>("/ads", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAdDTO): Promise<AdDTO> => {
    const response = await api.put<AdDTO>(`/ads/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<DeleteAdResponse> => {
    const response = await api.delete<DeleteAdResponse>(`/ads/${id}`);
    return response.data;
  },

  uploadImages: async (files: File[]): Promise<AdImage[]> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post<AdImage[]>("/ads/photos", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });

    return response.data;
  },

  deleteImages: async (publicIds: string[]): Promise<void> => {
    await api.delete("/ads/photos", {
      data: { publicIds },
    });
  },
};
