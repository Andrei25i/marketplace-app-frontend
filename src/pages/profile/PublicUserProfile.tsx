import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import usePublicUser from "@/hooks/auth/usePublicUser";
import { Center, Loader, Stack } from "@mantine/core";
import { useParams } from "react-router-dom";
import ProfileHeader from "./components/ProfileHeader";
import UserAdsSection from "./components/UserAdsSection";
import PublicProfileActions from "./components/PublicProfileActions";

const PublicUserProfile = () => {
  const { id } = useParams();
  const { user, isLoading, error, refetch } = usePublicUser(id);

  if (isLoading) {
    return (
      <Center mih="60vh">
        <Loader color="primary" />
      </Center>
    );
  }

  if (error || !user) {
    return (
      <Center mih="60vh">
        <RequestErrorAlert
          title="Profil indisponibil"
          message={error || "Utilizatorul nu a fost găsit."}
          onRetry={refetch}
        />
      </Center>
    );
  }

  return (
    <Stack gap="xl" pb={"md"}>
      <ProfileHeader user={user} actions={<PublicProfileActions />} />
      <UserAdsSection userId={String(user.id)} />
    </Stack>
  );
};

export default PublicUserProfile;
