import { getCategories } from "@/services/categories.service";
import type { CategoryDTO } from "@/types/category.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useQuery } from "@tanstack/react-query";

type UseCategoriesOptions = {
  limit?: number;
};

const NO_CATEGORIES: CategoryDTO[] = [];

export const useCategories = ({ limit }: UseCategoriesOptions = {}) => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (data) =>
      typeof limit === "number" && limit >= 0 ? data.slice(0, limit) : data,
  });

  return {
    categories: query.data ?? NO_CATEGORIES,
    isLoading: query.isLoading,
    error: query.error
      ? getErrorMessage(query.error, "Categoriile nu au putut fi încărcate.")
      : "",
    refetch: query.refetch,
  };
};
