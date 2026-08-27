import { useLoginForm } from "@/hooks/auth/useLoginForm";
import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconLock, IconMail, IconUser } from "@tabler/icons-react";
import { Form, Link } from "react-router-dom";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleSubmit,
  } = useLoginForm();

  return (
    <Center mih={{ base: "auto", sm: "100vh" }} py={{ base: "xl", sm: 0 }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "xl", lg: 48 }}
        m={{ base: "lg", sm: "xl" }}
        w="100%"
        maw={570}
        shadow="sm"
      >
        <Stack align="center" mb={40} gap="xs">
          <ThemeIcon
            size={64}
            radius="100%"
            color="primary.1"
            c="primary.6"
            mb="sm"
          >
            <IconUser size={32} />
          </ThemeIcon>

          <Title ta="center" order={1} size="h3">
            Conectează-te
          </Title>

          <Text ta="center" c={"dimmed"} size="sm">
            Conectează-te pentru a începe
          </Text>
        </Stack>

        <Form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Adresă de email"
              placeholder="nume@exemplu.ro"
              leftSection={<IconMail size={18} />}
              type="email"
              withAsterisk
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />

            <PasswordInput
              label="Parolă"
              placeholder="••••••••"
              leftSection={<IconLock size={18} />}
              withAsterisk
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />

            {error && (
              <Text c="red" size="sm" ta="center" mt="sm" fw={500}>
                {error}
              </Text>
            )}

            <Button
              type="submit"
              size="lg"
              radius="md"
              fullWidth
              mt="xl"
              loading={isLoading}
            >
              Conectează-te
            </Button>

            <Text c={"dimmed"} ta="center" size="sm" mt="xs">
              Nu ai un cont?{" "}
              <Text component={Link} to={"/register"} c="primary" fw={600}>
                Înregistrează-te
              </Text>
            </Text>
          </Stack>
        </Form>
      </Paper>
    </Center>
  );
};

export default Login;
