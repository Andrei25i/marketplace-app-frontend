import { useAuthStore } from "@/store/useAuthStore";
import { Stack } from "@mantine/core";
import ProfileHeader from "./components/ProfileHeader";
import FavoriteAdsSection from "./components/FavoriteAdsSection";
import UserAdsSection from "./components/UserAdsSection";

const MyProfile = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <>
      <Stack gap="xl" pb={"md"}>
        <ProfileHeader user={user} showPrivateDetails showActions />

        <UserAdsSection userId={String(user.id)} />

        <FavoriteAdsSection />
      </Stack>
    </>
  );
};

export default MyProfile;
