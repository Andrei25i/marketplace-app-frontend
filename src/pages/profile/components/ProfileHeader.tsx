import type { User } from "@/types/auth.type";
import { Avatar, Box, Divider, Flex, Paper, Stack } from "@mantine/core";

import ProfileActions from "./ProfileActions";
import ProfileInfo from "./ProfileInfo";

type ProfileHeaderProps = {
  user: User;
  showPrivateDetails?: boolean;
  showActions?: boolean;
  rating?: number;
  reviewCount?: number;
};

const ProfileHeader = ({
  user,
  showPrivateDetails = false,
  showActions = false,
  rating = 0,
  reviewCount = 0,
}: ProfileHeaderProps) => {
  const initials =
    `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();

  return (
    <Paper withBorder p={{ base: "md", sm: "lg", md: "xl" }}>
      <Stack
        gap="sm"
        style={{ flex: 1, minWidth: 0 }}
        ta={{ base: "center", sm: "left" }}
      >
        <Flex
          align="center"
          justify={{ base: "center", sm: "flex-start" }}
          direction={{ base: "column", sm: "row" }}
          gap={{ base: "md", sm: "lg" }}
          wrap="nowrap"
        >
          <Avatar
            size={88}
            radius="100%"
            color="primary.2"
            c="primary.6"
            style={{ flexShrink: 0, border: "4px solid white" }}
          >
            {initials}
          </Avatar>

          <ProfileInfo
            user={user}
            showPrivateDetails={showPrivateDetails}
            rating={rating}
            reviewCount={reviewCount}
          />

          {showActions && (
            <Flex visibleFrom="sm" gap="lg">
              <Divider orientation="vertical" />

              <Box w={190}>
                <ProfileActions />
              </Box>
            </Flex>
          )}
        </Flex>

        {showActions && (
          <Box hiddenFrom="sm">
            <Divider my="lg" />
            <ProfileActions />
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default ProfileHeader;
