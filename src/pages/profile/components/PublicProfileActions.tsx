import useStartConversation from "@/hooks/chat/useStartConversation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button, Stack } from "@mantine/core";
import { IconMessage, IconStar } from "@tabler/icons-react";

type PublicProfileActionsProps = {
  userId: string;
};
const PublicProfileActions = ({ userId }: PublicProfileActionsProps) => {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const isOwnProfile =
    currentUserId != null && String(currentUserId) === userId;
  const { startConversation, isStarting } = useStartConversation();

  return (
    <Stack gap="sm" maw={190} mx="auto" w="100%">
      {!isOwnProfile && (
        <Button
          fullWidth
          color="primary"
          leftSection={<IconMessage size={16} />}
          loading={isStarting}
          onClick={() => startConversation(userId)}
        >
          Trimite mesaj
        </Button>
      )}

      <Button fullWidth variant="default" leftSection={<IconStar size={16} />}>
        Lasă recenzie
      </Button>
    </Stack>
  );
};

export default PublicProfileActions;
