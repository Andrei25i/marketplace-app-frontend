import {
  Box,
  Divider,
  Flex,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";

type ProfileHeaderSkeletonProps = {
  withActions?: boolean;
};

const ActionsSkeleton = () => (
  <Stack gap="sm" maw={190} mx="auto" w="100%">
    <Skeleton height={36} radius="sm" />
    <Skeleton height={36} radius="sm" />
  </Stack>
);

const ProfileHeaderSkeleton = ({
  withActions = false,
}: ProfileHeaderSkeletonProps) => (
  <Paper
    withBorder
    p={{ base: "md", sm: "lg", md: "xl" }}
    role="status"
    aria-label="Se încarcă profilul"
    aria-busy
  >
    <Stack gap="sm" aria-hidden>
      <Flex
        align="center"
        justify={{ base: "center", sm: "flex-start" }}
        direction={{ base: "column", sm: "row" }}
        gap={{ base: "md", sm: "lg" }}
        wrap="nowrap"
      >
        <Skeleton circle height={88} style={{ flexShrink: 0 }} />

        <Stack gap="sm" w="100%" style={{ flex: 1, minWidth: 0 }}>
          <Skeleton
            width={240}
            maw="100%"
            radius="sm"
            mx={{ base: "auto", sm: 0 }}
          >
            <Title order={2} fz={{ base: 24, sm: 30 }} lh={1.15}>
              &nbsp;
            </Title>
          </Skeleton>

          <Skeleton
            width={220}
            maw="100%"
            radius="sm"
            mx={{ base: "auto", sm: 0 }}
          >
            <Text>&nbsp;</Text>
          </Skeleton>
        </Stack>

        {withActions && (
          <Flex visibleFrom="sm" gap="lg">
            <Divider orientation="vertical" />
            <Box w={190}>
              <ActionsSkeleton />
            </Box>
          </Flex>
        )}
      </Flex>

      {withActions && (
        <Box hiddenFrom="sm">
          <Divider my="lg" />
          <ActionsSkeleton />
        </Box>
      )}
    </Stack>
  </Paper>
);

export default ProfileHeaderSkeleton;
