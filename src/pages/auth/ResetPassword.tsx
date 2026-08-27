import { useResetPasswordForm } from "@/hooks/auth/useResetPasswordForm";
import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconLock } from "@tabler/icons-react";
import { Form, Link } from "react-router-dom";

const ResetPassword = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  } = useResetPasswordForm();

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
            <IconLock size={32} />
          </ThemeIcon>

          <Title ta="center" order={1} size="h3">
            Resetare parolă
          </Title>

          <Text ta="center" c={"dimmed"} size="sm">
            Introdu o noua parolă pentru contul tău.
          </Text>
        </Stack>

        <Form onSubmit={handleSubmit}>
          <Stack gap="md">
            <PasswordInput
              label="Parolă"
              placeholder="••••••••"
              leftSection={<IconLock size={18} />}
              withAsterisk
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <PasswordInput
              label="Confirmare parolă"
              placeholder="••••••••"
              leftSection={<IconLock size={18} />}
              withAsterisk
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
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
              Resetează Parola
            </Button>

            <Text
              component={Link}
              to={"/login"}
              c="primary"
              fw={600}
              size="sm"
              mt="xs"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <IconArrowLeft size={16} stroke={2} />
              Înapoi la autentificare
            </Text>
          </Stack>
        </Form>
      </Paper>
    </Center>
  );
};

export default ResetPassword;
