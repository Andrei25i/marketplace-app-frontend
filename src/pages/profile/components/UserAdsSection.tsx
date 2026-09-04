import AdsSection from "@/components/ui/sections/AdsSection";
import useAds from "@/hooks/ads/useAds";

type UserAdsSectionProps = {
  userId: string;
  isOwner?: boolean;
};

const UserAdsSection = ({ userId, isOwner = false }: UserAdsSectionProps) => {
  const { ads, isLoading, error, refetch } = useAds({
    userId,
    sort: "date_desc",
  });

  const emptyMessage = isOwner
    ? "Nu ai publicat încă niciun anunț."
    : "Utilizatorul nu a publicat încă un anunț.";

  return (
    <AdsSection
      title={`Anunțuri (${ads.length})`}
      ads={ads}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      emptyMessage={emptyMessage}
      viewAllTo="#"
      visibleAdsCount={5}
    />
  );
};

export default UserAdsSection;
