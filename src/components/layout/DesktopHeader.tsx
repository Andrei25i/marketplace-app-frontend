import { Group, Text, Button } from "@mantine/core";
import { Link } from "react-router-dom";

const DesktopHeader = () => {
  return (
    <Group h="100%" px="md" justify="space-between" align="center">
      <Text component={Link} to="/" fw={700} size="xl" c="primary">
        Logo
      </Text>

      <Text>search bar...</Text>

      <Group>
        <Button color="primary" component={Link} to="/post">
          + Postează
        </Button>
        <Button variant="outline" color="primary" component={Link} to="/login">
          Log In
        </Button>
      </Group>
    </Group>
  );
};

export default DesktopHeader;
