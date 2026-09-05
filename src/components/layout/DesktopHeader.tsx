import { Group, Text, Button } from "@mantine/core";
import { Link, matchPath, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import UserMenu from "./UserMenu";

const DesktopHeader = () => {
  const { pathname } = useLocation();

  const shouldShowSearchBar =
    pathname !== "/" &&
    pathname !== "/profile/favorites" &&
    !matchPath("/user/:id/ads", pathname);

  return (
    <Group h="100%" px="md" justify="space-between" align="center">
      <Text component={Link} to="/" fw={700} size="xl" c="primary">
        Logo
      </Text>

      {shouldShowSearchBar && <SearchBar />}

      <Group>
        <Button
          color="primary"
          component={Link}
          to="/post"
          leftSection={<IconCirclePlusFilled size={20} />}
        >
          Postează
        </Button>

        <UserMenu />
      </Group>
    </Group>
  );
};

export default DesktopHeader;
