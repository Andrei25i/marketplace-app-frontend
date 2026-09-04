import AdsSection from "@/components/ui/sections/AdsSection";
import useAds from "@/hooks/ads/useAds";

type UserAdsSectionProps = {
  userId: string;
};

const UserAdsSection = ({ userId }: UserAdsSectionProps) => {
  const { ads, isLoading, error, refetch } = useAds({
    userId,
    sort: "date_desc",
  });

  return (
    <AdsSection
      title={`Anunțuri (${ads.length})`}
      ads={ads}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      emptyMessage="Nu ai publicat încă niciun anunț."
      viewAllTo="#"
      visibleAdsCount={5}
    />
  );
};

export default UserAdsSection;
