import { Group, Skeleton, Stack, Text } from "@mantine/core";

const SessionRowSkeleton = () => (
  <Group wrap="nowrap" gap="sm" align="flex-start" py="xs">
    <Skeleton height={34} width={34} radius="md" style={{ flexShrink: 0 }} />

    <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
      <Skeleton width={90} radius="sm">
        <Text fw={600} size="sm">
          &nbsp;
        </Text>
      </Skeleton>
      <Skeleton width={170} maw="100%" radius="sm">
        <Text size="xs">&nbsp;</Text>
      </Skeleton>
      <Skeleton width={230} maw="100%" radius="sm">
        <Text size="xs">&nbsp;</Text>
      </Skeleton>
    </Stack>
  </Group>
);

const SectionLabelSkeleton = ({ width }: { width: number }) => (
  <Skeleton width={width} radius="sm">
    <Text size="xs">&nbsp;</Text>
  </Skeleton>
);

const SessionsSkeleton = () => (
  <Stack gap="lg" role="status" aria-label="Se încarcă sesiunile" aria-busy>
    <Stack gap={4} aria-hidden>
      <SectionLabelSkeleton width={140} />
      <SessionRowSkeleton />
    </Stack>

    <Stack gap={4} aria-hidden>
      <SectionLabelSkeleton width={120} />
    </Stack>
  </Stack>
);

export default SessionsSkeleton;
