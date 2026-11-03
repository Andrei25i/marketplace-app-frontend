import { Box, Group, Skeleton } from "@mantine/core";
import classes from "../Messages.module.css";

const ROWS = [
  { name: 120, preview: 180 },
  { name: 90, preview: 140 },
  { name: 140, preview: 200 },
  { name: 100, preview: 120 },
  { name: 130, preview: 170 },
  { name: 80, preview: 150 },
];

const ConversationListSkeleton = () => (
  <Box role="status" aria-label="Se încarcă conversațiile" aria-busy>
    {ROWS.map((row, index) => (
      <Box
        key={index}
        className={classes.item}
        style={{ pointerEvents: "none" }}
        aria-hidden
      >
        <Group wrap="nowrap" gap="sm">
          <Skeleton circle height={44} style={{ flexShrink: 0 }} />

          <Box style={{ flex: 1, minWidth: 0 }}>
            <Group justify="space-between" wrap="nowrap" gap="xs">
              <Skeleton height={12} width={row.name} radius="sm" />
              <Skeleton height={10} width={32} radius="sm" />
            </Group>
            <Skeleton
              height={10}
              width={row.preview}
              maw="100%"
              radius="sm"
              mt={10}
            />
          </Box>
        </Group>
      </Box>
    ))}
  </Box>
);

export default ConversationListSkeleton;
