import type { PublicUser, User } from "@/types/auth.type";
import { Divider, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { IconMail, IconMapPin, IconPhone, IconStar } from "@tabler/icons-react";
import { memberSince } from "@/utils/format.util";

type ProfileInfoProps = {
  user: PublicUser;
  showPrivateDetails?: boolean;
  rating?: number;
  reviewCount?: number;
};

const isPrivateUser = (user: PublicUser): user is User =>
  "email" in user && "phone_number" in user && "city" in user;

const ProfileInfo = ({
  user,
  showPrivateDetails = false,
  rating = 0,
  reviewCount = 0,
}: ProfileInfoProps) => {
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <Stack gap="sm" style={{ flex: 1, minWidth: 0 }}>
      <Title order={1} fz={{ base: 24, sm: 30 }} lh={1.15}>
        {fullName}
      </Title>

      {showPrivateDetails && isPrivateUser(user) && (
        <Flex
          gap="md"
          wrap="wrap"
          c="dimmed"
          justify={{ base: "center", sm: "flex-start" }}
        >
          <Group gap={6} wrap="nowrap" miw={0}>
            <IconMail size={16} style={{ flexShrink: 0 }} />
            <Text size="sm" truncate>
              {user.email}
            </Text>
          </Group>

          <Group gap={6} wrap="nowrap">
            <IconPhone size={16} />
            <Text size="sm">{user.phone_number}</Text>
          </Group>

          <Group gap={6} wrap="nowrap">
            <IconMapPin size={16} />
            <Text size="sm">{user.city}</Text>
          </Group>
        </Flex>
      )}

      <Flex gap="sm" wrap="wrap" justify={{ base: "center", sm: "flex-start" }}>
        <Group gap={4} c="primary.6" wrap="nowrap">
          <IconStar size={16} fill="currentColor" />
          <Text fw={600} c="dark.6">
            {rating.toFixed(1)} ({reviewCount})
          </Text>
        </Group>

        <Divider orientation="vertical" visibleFrom="sm" />

        <Text size="sm" c="dimmed">
          Membru din{" "}
          <Text component="span" inherit fw={600} c="dark.6">
            {memberSince(user.created_at)}
          </Text>
        </Text>
      </Flex>
    </Stack>
  );
};

export default ProfileInfo;
