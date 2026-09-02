import { Box, Card, Stack, Text } from "@mantine/core";
import { IconExclamationMark } from "@tabler/icons-react";

const EmptyResults = () => {
  return (
    <Card
      p="xl"
      h="100%"
      withBorder
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack align="center" gap="xs">
        <Box
          w={58}
          h={58}
          bg="primary.1"
          c="primary.6"
          style={{
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
          }}
        >
          <IconExclamationMark size={32} />
        </Box>

        <Text fw={700} fz="lg" c="dark">
          Nu s-au găsit rezultate
        </Text>

        <Text c="dimmed" ta="center" maw={420}>
          Nu există anunțuri care să corespundă căutării tale. Încearcă alte
          filtre sau o căutare diferită.
        </Text>
      </Stack>
    </Card>
  );
};

export default EmptyResults;
