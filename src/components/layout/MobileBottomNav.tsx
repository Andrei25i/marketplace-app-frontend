import { Group, Stack, UnstyledButton, Text, Indicator } from "@mantine/core";
import {
  IconHome,
  IconMessage,
  IconPlusFilled,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import classes from "./MobileBottomNav.module.css";
import useUnreadCount from "@/hooks/chat/useUnreadCount";
import { formatUnreadCount } from "@/utils/chat.util";

const MobileBottomNav = () => {
  const location = useLocation();
  const { unreadCount } = useUnreadCount();

  const navItems = [
    { icon: IconHome, label: "Acasă", path: "/", badge: 0 },
    { icon: IconSearch, label: "Caută", path: "/search", badge: 0 },
    { icon: IconPlusFilled, label: "Postează", path: "/post", badge: 0 },
    {
      icon: IconMessage,
      label: "Mesaje",
      path: "/messages",
      badge: unreadCount,
    },
    { icon: IconUser, label: "Profil", path: "/profile", badge: 0 },
  ];

  return (
    <Group
      h="100%"
      justify="space-around"
      align="center"
      px="xs"
      bg="white"
      wrap="nowrap"
      className={classes.navContainer}
    >
      {navItems.map((item) => {
        const isActive =
          item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);

        return (
          <UnstyledButton
            key={item.path}
            component={Link}
            to={item.path}
            className={classes.navButton}
          >
            <Stack gap={2} align="center" c={isActive ? "primary" : "gray"}>
              <Indicator
                label={formatUnreadCount(item.badge)}
                size={16}
                offset={2}
                color="red"
                disabled={item.badge === 0}
              >
                <item.icon size={24} stroke={2} />
              </Indicator>
              <Text size={"12px"} fw={"500"} tt="uppercase">
                {item.label}
              </Text>
            </Stack>
          </UnstyledButton>
        );
      })}
    </Group>
  );
};

export default MobileBottomNav;
