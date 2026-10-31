import { Group, Text, Button, Indicator, ActionIcon } from "@mantine/core";
import { Link, matchPath, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { IconCirclePlusFilled, IconMessage } from "@tabler/icons-react";
import UserAvatar from "./UserAvatar";
import { useAuthStore } from "@/store/useAuthStore";
import useUnreadCount from "@/hooks/chat/useUnreadCount";
import { formatUnreadCount } from "@/utils/chat.util";
import classes from "./DesktopHeader.module.css";

const DesktopHeader = () => {
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { unreadCount } = useUnreadCount();

  const shouldShowSearchBar =
    pathname !== "/" &&
    pathname !== "/profile/favorites" &&
    !pathname.startsWith("/messages") &&
    !matchPath("/user/:id/ads", pathname);

  return (
    <Group h="100%" px="md" justify="space-between" align="center">
      <Text component={Link} to="/" fw={700} size="xl" c="primary">
        Logo
      </Text>

      {shouldShowSearchBar && <SearchBar />}

      <Group>
        {isAuthenticated && (
          <Indicator
            label={formatUnreadCount(unreadCount)}
            size={20}
            offset={5}
            color="red"
            disabled={unreadCount === 0}
            className={classes.messagesIndicator}
            styles={{ indicator: { pointerEvents: "none" } }}
          >
            <ActionIcon
              component={Link}
              to="/messages"
              variant="subtle"
              color="gray"
              size="lg"
              radius="xl"
              aria-label="Mesaje"
            >
              <IconMessage size={22} />
            </ActionIcon>
          </Indicator>
        )}

        <Button
          color="primary"
          component={Link}
          to="/post"
          leftSection={<IconCirclePlusFilled size={20} />}
        >
          Postează
        </Button>

        <UserAvatar />
      </Group>
    </Group>
  );
};

export default DesktopHeader;
