import { favoritesService } from "@/services/favorites.service";
import type { GetAdsFilters } from "@/types/ads.type";
import type { FavoriteAdDTO } from "@/types/favorite.types";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback, useEffect, useState } from "react";

type UseFavoriteAdsOptions = {
  limit?: number;
};

const DEFAULT_FILTERS: GetAdsFilters = {
  sort: "date_desc",
};

const useFavoriteAds = (
  filters: GetAdsFilters = DEFAULT_FILTERS,
  { limit }: UseFavoriteAdsOptions = {},
) => {
  const [ads, setAds] = useState<FavoriteAdDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filtersKey = JSON.stringify(filters);

  const fetchFavoriteAds = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await favoritesService.getAll(filters);
      const limitedAds =
        typeof limit === "number" && limit >= 0 ? data.slice(0, limit) : data;

      setAds(limitedAds);
    } catch (err) {
      console.error("Eroare la obținerea anunțurilor favorite", err);
      setError(
        getErrorMessage(err, "Nu s-au putut obține anunțurile favorite."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [filtersKey, limit]);

  useEffect(() => {
    void fetchFavoriteAds();
  }, [fetchFavoriteAds]);

  return {
    ads,
    isLoading,
    error,
    refetch: fetchFavoriteAds,
  };
};

export default useFavoriteAds;
