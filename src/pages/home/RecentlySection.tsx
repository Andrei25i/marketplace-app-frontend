import AdsSection from "@/components/ui/sections/AdsSection";
import useAds from "@/hooks/ads/useAds";
import type { GetAdsFilters } from "@/types/ads.type";

import { useMemo } from "react";

const RecentlySection = () => {
  const filters = useMemo<GetAdsFilters>(() => ({ sort: "date_desc" }), []);
  const { ads, isLoading, error, refetch } = useAds(filters);

  return (
    <AdsSection
      title="Adăugate recent"
      description="Descoperă cele mai noi anunțuri."
      ads={ads}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      viewAllTo="/search?sort=date_desc"
      hideWhenEmpty
      visibleAdsCount={5}
    />
  );
};

export default RecentlySection;
