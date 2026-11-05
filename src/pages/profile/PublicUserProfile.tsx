import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import usePublicUser from "@/hooks/auth/usePublicUser";
import { Center, Stack } from "@mantine/core";
import { useParams } from "react-router-dom";
import ProfileHeader from "./components/ProfileHeader";
import UserAdsSection from "./components/UserAdsSection";
import PublicProfileActions from "./components/PublicProfileActions";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";

const PublicUserProfile = () => {
  const { id } = useParams();
  const { user, isLoading, error, refetch } = usePublicUser(id);

  if (!isLoading && (error || !user)) {
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
    <Stack gap="xl" pb="md">
      {user ? (
        <ProfileHeader
          user={user}
          actions={<PublicProfileActions userId={String(user.id)} />}
        />
      ) : (
        <ProfileHeaderSkeleton withActions />
      )}

      {id && <UserAdsSection userId={id} />}
    </Stack>
  );
};

export default PublicUserProfile;
