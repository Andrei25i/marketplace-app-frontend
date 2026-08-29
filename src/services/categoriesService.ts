import { api } from "@/api/api";
import type { CategoryDTO } from "@/types/category";

export const getCategories = async (): Promise<CategoryDTO[]> => {
  const response = await api.get<CategoryDTO[]>("/categories");

  return response.data;
};
