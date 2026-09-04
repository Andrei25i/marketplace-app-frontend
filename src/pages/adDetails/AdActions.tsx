import BackButton from "@/components/navigation/BackButton";
import { useAuthStore } from "@/store/useAuthStore";
import type { AdDetailsDTO } from "@/types/ads.type";
import { Button, Group } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

type AdActionsProps = {
  ad: AdDetailsDTO;
};

const AdActions = ({ ad }: AdActionsProps) => {
  const user = useAuthStore((state) => state.user);
  const isOwner = Boolean(user && String(ad.user.id) === String(user.id));

  const handleEdit = () => {
    console.log("Edit ad:", ad.id);
  };

  const handleDelete = () => {
    console.log("Delete ad:", ad.id);
  };

  return (
    <Group justify="space-between" align="center" mb="xl" wrap="wrap">
      <BackButton mb={0} />

      {isOwner && (
        <Group gap="sm">
          <Button
            variant="light"
            color="primary"
            leftSection={<IconPencil size={16} />}
            onClick={handleEdit}
          >
            Edit
          </Button>

          <Button
            variant="light"
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Group>
      )}
    </Group>
  );
};

export default AdActions;
