import type { GetAdsFilters } from "@/types/ads.type";
import {
  parseFiltersFromUrl,
  parsePageFromUrl,
  updateUrlWithFilters,
} from "@/utils/searchFilters.util";
import { useSearchParams } from "react-router-dom";

export const useSearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = parseFiltersFromUrl(searchParams);
  const page = parsePageFromUrl(searchParams);

  const updateFilters = (nextFilters: GetAdsFilters, resetPage = true) => {
    setSearchParams(
      (params) => {
        const updated = updateUrlWithFilters(params, nextFilters);
        if (resetPage) updated.delete("page");
        return updated;
      },
      { replace: true },
    );
  };

  const updatePage = (nextPage: number) => {
    setSearchParams(
      (params) => {
        if (nextPage === 1) params.delete("page");
        else params.set("page", String(nextPage));
        return params;
      },
      { replace: true },
    );
  };

  return { filters, page, updateFilters, updatePage };
};
