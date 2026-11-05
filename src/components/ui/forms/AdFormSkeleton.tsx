import {
  Box,
  Flex,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import AdFormHeader from "./AdFormHeader";
import SectionTitle from "./SectionTitle";

type AdFormSkeletonProps = {
  heading: string;
  subheading: string;
};

const IMAGE_TILES = 3;

const FieldSkeleton = ({
  labelWidth,
  height = 36,
}: {
  labelWidth: number;
  height?: number;
}) => (
  <Stack gap={6}>
    <Skeleton width={labelWidth} radius="sm">
      <Text fz={10}>&nbsp;</Text>
    </Skeleton>
    <Skeleton height={height} radius="sm" />
  </Stack>
);

const AdFormSkeleton = ({ heading, subheading }: AdFormSkeletonProps) => (
  <Stack maw={700} mx="auto" gap="lg">
    <Paper
      p={{ base: "md", sm: "xl" }}
      withBorder
      radius="md"
      role="status"
      aria-label="Se încarcă anunțul"
      aria-busy
    >
      <AdFormHeader heading={heading} subheading={subheading} />

      <Stack gap="lg">
        <Stack gap="xs">
          <SectionTitle>Detalii anunț</SectionTitle>
          <FieldSkeleton labelWidth={40} />
          <FieldSkeleton labelWidth={70} />
          <FieldSkeleton labelWidth={70} height={80} />
        </Stack>

        <Stack gap="xs">
          <SectionTitle>Imagini</SectionTitle>
          <Text size="xs" c="dimmed">
            Doar fișiere imagine, maximum 10 imagini, fiecare de cel mult 5MB.
          </Text>
          <SimpleGrid cols={{ base: 3, sm: 4 }} spacing="sm">
            {Array.from({ length: IMAGE_TILES }, (_, index) => (
              <Skeleton
                key={index}
                radius="md"
                style={{ aspectRatio: "1 / 1" }}
              />
            ))}
          </SimpleGrid>
        </Stack>

        <Stack gap="xs">
          <SectionTitle>Preț</SectionTitle>
          <Group grow align="flex-start">
            <FieldSkeleton labelWidth={50} />
            <FieldSkeleton labelWidth={55} />
          </Group>
        </Stack>

        <Stack gap="xs">
          <SectionTitle>Adresă și contact</SectionTitle>
          <FieldSkeleton labelWidth={55} />
          <Flex gap="md" wrap="wrap">
            <Box style={{ flex: "1 1 140px" }}>
              <FieldSkeleton labelWidth={45} />
            </Box>
            <Box style={{ flex: "1 1 140px" }}>
              <FieldSkeleton labelWidth={70} />
            </Box>
          </Flex>
        </Stack>

        <Group justify="flex-end" mt="sm">
          <Skeleton height={36} width={90} radius="sm" />
          <Skeleton height={36} width={110} radius="sm" />
        </Group>
      </Stack>
    </Paper>
  </Stack>
);

export default AdFormSkeleton;
