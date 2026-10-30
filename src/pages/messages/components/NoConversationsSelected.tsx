import { Center, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconMessages } from "@tabler/icons-react";

const NoConversationsSelected = () => {
  return (
    <Center h="80%" p="xl">
      <Stack align="center" gap="xs" ta="center" maw={320}>
        <ThemeIcon size={64}>
          <IconMessages size={32} />
        </ThemeIcon>
        <Title order={3} size="h4">
          Mesajele tale
        </Title>
        <Text size="sm" c="dimmed">
          Alege o conversație, iar mesajele vor apărea aici.
        </Text>
      </Stack>
    </Center>
  );
};

export default NoConversationsSelected;
