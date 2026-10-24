import { adsService } from "@/services/ads.service";
import { getErrorMessage } from "@/utils/getErrorMessage.util";
import { useQuery } from "@tanstack/react-query";

const useAd = (id?: string) => {
  const query = useQuery({
    queryKey: ["ad", id],
    queryFn: () => adsService.getById(id as string),
    enabled: Boolean(id),
  });

  return {
    ad: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error
      ? getErrorMessage(query.error, "Nu s-a putut obține anunțul.")
      : "",
    refetch: query.refetch,
  };
};

export default useAd;
