import { adsService } from "@/services/ads.service";
import type { AdDTO, GetAdsFilters } from "@/types/ads.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useQuery } from "@tanstack/react-query";

type UseAdsOptions = {
  limit?: number;
};

const EMPTY_FILTERS: GetAdsFilters = {};
const NO_ADS: AdDTO[] = [];

const useAds = (
  filters: GetAdsFilters = EMPTY_FILTERS,
  { limit }: UseAdsOptions = {},
) => {
  const query = useQuery({
    queryKey: ["ads", filters] as const,
    queryFn: () => adsService.getAll(filters),
    select: (data) =>
      typeof limit === "number" && limit >= 0 ? data.slice(0, limit) : data,
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1].userId === filters.userId
        ? previousData
        : undefined,
  });

  return {
    ads: query.data ?? NO_ADS,
    isLoading: query.isLoading,
    isRefreshing: query.isPlaceholderData,
    error: query.error
      ? getErrorMessage(query.error, "Nu s-au putut obține anunțurile.")
      : "",
    refetch: query.refetch,
  };
};

export default useAds;
