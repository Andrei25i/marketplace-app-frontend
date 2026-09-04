import { adsService } from "@/services/ads.service";
import type { AdDetailsDTO } from "@/types/ads.type";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useCallback, useEffect, useState } from "react";

const useAd = (id?: string) => {
  const [ad, setAd] = useState<AdDetailsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAd = useCallback(async () => {
    if (!id) {
      setAd(null);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await adsService.getById(id);
      setAd(data);
    } catch (err) {
      setError(getErrorMessage(err, "Nu s-a  putut obține anunțul."));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchAd();
  }, [fetchAd]);

  return { ad, isLoading, error, refetch: fetchAd };
};

export default useAd;
