import { favoritesService } from "@/services/favorites.service";
import type { GetAdsFilters } from "@/types/ads.type";
import type { FavoriteAdDTO } from "@/types/favorite.types";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useQuery } from "@tanstack/react-query";

type UseFavoriteAdsOptions = {
  limit?: number;
};

const DEFAULT_FILTERS: GetAdsFilters = {
  sort: "date_desc",
};
const NO_ADS: FavoriteAdDTO[] = [];

const useFavoriteAds = (
  filters: GetAdsFilters = DEFAULT_FILTERS,
  { limit }: UseFavoriteAdsOptions = {},
) => {
  const query = useQuery({
    queryKey: ["favorites", filters],
    queryFn: () => favoritesService.getAll(filters),
    select: (data) =>
      typeof limit === "number" && limit >= 0 ? data.slice(0, limit) : data,
  });

  return {
    ads: query.data ?? NO_ADS,
    isLoading: query.isLoading,
    error: query.error
      ? getErrorMessage(
          query.error,
          "Nu s-au putut obține anunțurile favorite.",
        )
      : "",
    refetch: query.refetch,
  };
};

export default useFavoriteAds;
