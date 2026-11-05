import {
  Box,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";

const THUMBNAIL_COUNT = 4;
const DESCRIPTION_LINES = ["100%", "95%", "98%", "70%"];

const AdDetailsSkeleton = () => {
  return (
    <Container
      size="xl"
      p={0}
      role="status"
      aria-label="Se încarcă anunțul"
      aria-busy
    >
      <Flex
        gap="xl"
        mt="sm"
        direction={{ base: "column", md: "row" }}
        aria-hidden
      >
        <Flex
          w={{ base: "100%", md: "55%" }}
          direction="column"
          align={{ base: "center", md: "flex-start" }}
          justify="center"
          gap="md"
        >
          <Box style={{ width: "100%", maxWidth: 650 }}>
            <Skeleton height="clamp(250px, 45vw, 400px)" radius={12} />
            <Group gap={12} wrap="nowrap" mt="md" pb="md">
              {Array.from({ length: THUMBNAIL_COUNT }, (_, index) => (
                <Skeleton
                  key={index}
                  width={75}
                  height={75}
                  radius={12}
                  style={{ flexShrink: 0 }}
                />
              ))}
            </Group>
          </Box>
        </Flex>

        <Box w={{ base: "100%", md: "45%" }}>
          <Card withBorder p={{ base: "md", sm: "xl" }}>
            <Stack gap="xs">
              <Group justify="space-between" mb="xs">
                <Skeleton height={22} width={90} radius="xl" />
                <Skeleton height={30} width={90} radius="xl" />
              </Group>

              <Skeleton width="85%" radius="sm">
                <Title order={2} size="h3">
                  &nbsp;
                </Title>
              </Skeleton>

              <Group justify="space-between" wrap="wrap">
                <Skeleton width={160} radius="sm">
                  <Text size="sm">&nbsp;</Text>
                </Skeleton>
                <Skeleton width={80} radius="sm">
                  <Text size="sm">&nbsp;</Text>
                </Skeleton>
              </Group>

              <Skeleton width={150} radius="sm" mt="xs" mb="sm">
                <Text size="24px" fw={700}>
                  &nbsp;
                </Text>
              </Skeleton>

              <Stack gap="xs" pt="xs">
                <Skeleton height={42} radius="md" />
                <Skeleton height={42} radius="md" />
              </Stack>
            </Stack>
          </Card>

          <Card withBorder p={{ base: "md", sm: "xl" }} mt="md">
            <Stack gap="md">
              <Group gap="md">
                <Skeleton circle height={46} />
                <Stack gap={4}>
                  <Skeleton width={150} radius="sm">
                    <Text size="lg">&nbsp;</Text>
                  </Skeleton>
                  <Skeleton height={14} width={110} radius="sm" />
                </Stack>
              </Group>

              <Divider />

              <Skeleton height={36} radius="sm" />
            </Stack>
          </Card>
        </Box>
      </Flex>

      <Box mt="xl" w={{ base: "100%", md: 650 }} aria-hidden>
        <Paper
          p="md"
          withBorder
          style={{ borderLeft: "4px solid var(--mantine-color-primary-6)" }}
        >
          <Skeleton height={12} width={90} radius="sm" mb="md" />
          <Stack gap={12}>
            {DESCRIPTION_LINES.map((width, index) => (
              <Skeleton key={index} height={12} width={width} radius="sm" />
            ))}
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdDetailsSkeleton;
