import { Button, Center, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Center mih="100dvh" p="md">
      <Stack align="center" gap="md">
        <Title
          order={1}
          style={{ fontSize: 120, fontWeight: 900, lineHeight: 1 }}
          c="primary"
        >
          404
        </Title>

        <Title order={2} size="h2" ta="center">
          Pagina nu a fost găsită!
        </Title>

        <Text c="dimmed" ta="center" maw={400} mb="xl">
          Conținutul pe care îl cauți ar fi putut fi mutat, șters sau poate că
          nu a existat niciodată.
        </Text>

        <Button
          component={Link}
          to="/"
          size="md"
          radius="md"
          leftSection={<IconArrowLeft size={16} />}
        >
          Înapoi acasă
        </Button>
      </Stack>
    </Center>
  );
};

export default NotFound;
