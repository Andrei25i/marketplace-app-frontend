import {
  AD_SORT_OPTIONS,
  type AdSortOption,
  type GetAdsFilters,
} from "@/types/ads.type";

export const DEFAULT_AD_FILTERS: GetAdsFilters = {
  sort: "date_desc",
  minPrice: "0",
};

const isValidSortOption = (value: string | null): value is AdSortOption => {
  return AD_SORT_OPTIONS.some((opt) => opt.value === value);
};

const parsePositiveInteger = (value: string | null) => {
  if (!value || !/^\d+$/.test(value)) {
    return undefined;
  }

  const parsedValue = Number(value);

  return parsedValue > 0 ? String(parsedValue) : undefined;
};

const parseNonNegativeNumber = (value: string | null) => {
  if (!value || !/^\d+(\.\d+)?$/.test(value)) {
    return undefined;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue >= 0
    ? String(parsedValue)
    : undefined;
};

export const parseFiltersFromUrl = (params: URLSearchParams): GetAdsFilters => {
  const sort = params.get("sort");

  return {
    search: params.get("q")?.trim() || undefined,
    category: parsePositiveInteger(params.get("category")),
    minPrice: parseNonNegativeNumber(params.get("minPrice")) ?? "0",
    maxPrice: parseNonNegativeNumber(params.get("maxPrice")),
    city: params.get("city")?.trim() || undefined,
    sort: isValidSortOption(sort) ? sort : "date_desc",
  };
};

export const parsePageFromUrl = (params: URLSearchParams) => {
  const page = Number(params.get("page"));

  return Number.isInteger(page) && page >= 1 ? page : 1;
};

export const updateUrlWithFilters = (
  params: URLSearchParams,
  filters: GetAdsFilters,
) => {
  const nextParams = new URLSearchParams(params);

  const setOrDelete = (key: string, value?: string) => {
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
  };

  setOrDelete("q", filters.search);
  setOrDelete("category", filters.category);
  setOrDelete("city", filters.city);
  setOrDelete(
    "minPrice",
    filters.minPrice === "0" ? undefined : filters.minPrice,
  );
  setOrDelete("maxPrice", filters.maxPrice);
  setOrDelete("sort", filters.sort === "date_desc" ? undefined : filters.sort);

  return nextParams;
};
