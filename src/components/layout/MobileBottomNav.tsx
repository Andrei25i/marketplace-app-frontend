import { Group, Stack, UnstyledButton, Text } from "@mantine/core";
import {
  IconHome,
  IconPlusFilled,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";
import classes from "./MobileBottomNav.module.css";

const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: IconHome, label: "Acasă", path: "/" },
    { icon: IconSearch, label: "Caută", path: "/search" },
    { icon: IconPlusFilled, label: "Postează", path: "/post" },
    { icon: IconUser, label: "Profil", path: "/profile" },
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
        const isActive = location.pathname === item.path;

        return (
          <UnstyledButton
            key={item.path}
            component={Link}
            to={item.path}
            className={classes.navButton}
          >
            <Stack gap={3} align="center" c={isActive ? "primary" : "gray"}>
              <item.icon size={24} stroke={2} />
              <Text size="xs" fw={"500"} tt="uppercase">
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
