import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Center mb="xl">
      <Paper w="100%" p={{ base: "lg", md: "xl" }} radius="lg" withBorder>
        <Center>
          <Stack align="center" gap="sm">
            <Title order={2} size="h4" fw={700} ta="center">
              Ai lucruri de care nu mai ai nevoie?
            </Title>
            <Text ta="center" size="md" c="dark.3" maw={700} mb="sm">
              Fă-le o poză, adaugă o scurtă descriere și găsește-le un nou
              proprietar.
            </Text>
            <Button component={Link} to="/post" size="md" radius="md" fw={600}>
              Adaugă un anunț gratuit
            </Button>
          </Stack>
        </Center>
      </Paper>
    </Center>
  );
};

export default Footer;
