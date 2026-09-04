import { Button, Stack } from "@mantine/core";
import { IconMessage, IconStar } from "@tabler/icons-react";

const PublicProfileActions = () => {
  return (
    <Stack gap="sm" maw={190} mx="auto" w="100%">
      <Button fullWidth color="primary" leftSection={<IconMessage size={16} />}>
        Trimite mesaj
      </Button>

      <Button fullWidth variant="default" leftSection={<IconStar size={16} />}>
        Lasă recenzie
      </Button>
    </Stack>
  );
};

export default PublicProfileActions;
