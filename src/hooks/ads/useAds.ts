import { adsService } from "@/services/ads.service";
import type { AdDTO, GetAdsFilters } from "@/types/ads.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback, useEffect, useState } from "react";

type UseAdsOptions = {
  limit?: number;
};

const EMPTY_FILTERS: GetAdsFilters = {};

const useAds = (
  filters: GetAdsFilters = EMPTY_FILTERS,
  { limit }: UseAdsOptions = {},
) => {
  const [ads, setAds] = useState<AdDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filtersKey = JSON.stringify(filters);

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await adsService.getAll(filters);
      const limitedAds =
        typeof limit === "number" && limit >= 0 ? data.slice(0, limit) : data;

      setAds(limitedAds);
    } catch (err) {
      console.error("Eroare la obținerea anunțurilor", err);
      setError(getErrorMessage(err, "Nu s-au putut obține anunțurile."));
    } finally {
      setIsLoading(false);
    }
  }, [filtersKey, limit]);

  useEffect(() => {
    void fetchAds();
  }, [fetchAds]);

  return { ads, isLoading, error, refetch: fetchAds };
};

export default useAds;
