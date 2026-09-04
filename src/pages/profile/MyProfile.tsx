import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "@mantine/core";
import ProfileHeader from "./components/ProfileHeader";
import FavoriteAdsSection from "./components/FavoriteAdsSection";
import UserAdsSection from "./components/UserAdsSection";
import ProfileActions from "./components/ProfileActions";

const MyProfile = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <Stack gap="xl" pb={"md"}>
      <ProfileHeader
        user={user}
        showPrivateDetails
        actions={<ProfileActions />}
      />
      <UserAdsSection userId={String(user.id)} isOwner />
      <FavoriteAdsSection />
    </Stack>
  );
};

export default MyProfile;
