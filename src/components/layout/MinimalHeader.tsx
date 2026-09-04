import { Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const MinimalHeader = () => (
  <Group h="100%" px="md" align="center">
    <Text component={Link} to="/" fw={700} size="xl" c="primary">
      Logo
    </Text>
  </Group>
);

export default MinimalHeader;
