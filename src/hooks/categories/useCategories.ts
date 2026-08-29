import { getCategories } from "@/services/categories.service";
import type { CategoryDTO } from "@/types/category.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback, useEffect, useState } from "react";

type UseCategoriesOptions = {
  limit?: number;
};

export const useCategories = ({ limit }: UseCategoriesOptions = {}) => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getCategories();

      const filteredCategories =
        typeof limit === "number" && limit >= 0 ? data.slice(0, limit) : data;

      setCategories(filteredCategories);
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        "Categoriile nu au putut fi încărcate.",
      );
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, refetch: fetchCategories };
};
