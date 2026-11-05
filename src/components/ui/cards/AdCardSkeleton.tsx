import { Card, Group, Skeleton, Stack, Text } from "@mantine/core";
import classes from "@/components/ui/cards/AdCard.module.css";

const AdCardSkeleton = () => {
  return (
    <Card
      withBorder
      radius="md"
      padding={0}
      className={classes.card}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Card.Section className={classes.imageSection}>
        <Skeleton height="100%" radius={0} />
      </Card.Section>

      <Stack gap="xs" p="xs" style={{ flexGrow: 1 }}>
        <Stack gap={4}>
          <Skeleton width="80%" radius="sm">
            <Text size="sm" lh="tight">
              &nbsp;
            </Text>
          </Skeleton>

          <Skeleton width="40%" radius="sm">
            <Text size="sm">&nbsp;</Text>
          </Skeleton>
        </Stack>

        <Stack gap={2}>
          <Skeleton radius="sm">
            <Text size="xs">&nbsp;</Text>
          </Skeleton>
          <Skeleton width="65%" radius="sm">
            <Text size="xs">&nbsp;</Text>
          </Skeleton>
        </Stack>

        <Group justify="space-between" mt="auto" wrap="nowrap">
          <Skeleton width={70} radius="sm">
            <Text size="xs">&nbsp;</Text>
          </Skeleton>
          <Skeleton width={50} radius="sm">
            <Text size="xs">&nbsp;</Text>
          </Skeleton>
        </Group>
      </Stack>
    </Card>
  );
};

export default AdCardSkeleton;
