import BackButton from "@/components/navigation/BackButton";
import { adsService } from "@/services/ads.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { AdDetailsDTO } from "@/types/ads.type";
import { Button, Group } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAdModal from "./DeleteAdModal";

type AdActionsProps = {
  ad: AdDetailsDTO;
};

const AdActions = ({ ad }: AdActionsProps) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isOwner = Boolean(user && String(ad.user.id) === String(user.id));

  const handleEdit = () => {
    console.log("Edit ad:", ad.id);
  };

  const handleDelete = async () => {
    await adsService.delete(ad.id);
    setIsDeleteModalOpen(false);
    navigate(-1);
  };

  return (
    <>
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
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </Group>
        )}
      </Group>

      <DeleteAdModal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AdActions;
