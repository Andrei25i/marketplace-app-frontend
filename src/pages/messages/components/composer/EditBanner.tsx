import { Box, CloseButton, Group, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import classes from "@/pages/messages/Messages.module.css";

type EditBannerProps = {
  content: string | null;
  onCancel: () => void;
};

const EditBanner = ({ content, onCancel }: EditBannerProps) => {
  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      mb="xs"
      className={classes.editBanner}
    >
      <Box style={{ minWidth: 0 }}>
        <Group gap={4} wrap="nowrap">
          <IconPencil size={14} color="var(--mantine-color-primary-6)" />
          <Text size="xs" fw={600} c="primary">
            Editezi mesajul
          </Text>
        </Group>
        <Text size="xs" c="dimmed" lineClamp={1}>
          {content}
        </Text>
      </Box>
      <CloseButton
        size="sm"
        onClick={onCancel}
        aria-label="Anulează editarea"
      />
    </Group>
  );
};

export default EditBanner;
