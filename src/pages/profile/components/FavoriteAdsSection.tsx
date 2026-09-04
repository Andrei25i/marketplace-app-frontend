import AdsSection from "@/components/ui/sections/AdsSection";
import useFavoriteAds from "@/hooks/ads/useFavoriteAds";

const FavoriteAdsSection = () => {
  const { ads, isLoading, error, refetch } = useFavoriteAds();

  return (
    <AdsSection
      title={`Favorite (${ads.length})`}
      ads={ads}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      emptyMessage="Nu ai salvat încă niciun anunț."
      viewAllTo="#"
      visibleAdsCount={5}
    />
  );
};

export default FavoriteAdsSection;
