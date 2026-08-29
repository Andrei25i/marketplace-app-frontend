import { useForgotPasswordForm } from "@/hooks/auth/useForgotPasswordForm";
import {
  Alert,
  Button,
  Center,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconArrowLeft,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import { Form, Link } from "react-router-dom";

const ForgotPassword = () => {
  const { email, setEmail, error, isLoading, isSent, handleSubmit } =
    useForgotPasswordForm();

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
          <ThemeIcon size={64} mb="sm">
            <IconLock size={32} />
          </ThemeIcon>

          <Title ta="center" order={1} size="h3">
            Ai uitat parola?
          </Title>

          <Text ta="center" c={"dimmed"} size="sm">
            Introdu adresa de email asociată contului și îți vom trimite un link
            pentru resetarea parolei.
          </Text>
        </Stack>

        {isSent ? (
          <Stack align="center">
            <Text ta="center" fw={500} c="green">
              Verifică-ți adresa de email!
            </Text>
            <Text ta="center" c="dimmed" size="sm">
              Dacă adresa <b>{email}</b> este asociată unui cont, vei primi un
              link pentru resetarea parolei.
            </Text>
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
        ) : (
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

              {error && (
                <Alert
                  variant="light"
                  color="red"
                  radius="md"
                  icon={<IconAlertCircle size={18} />}
                  mt="sm"
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                size="lg"
                radius="md"
                fullWidth
                mt="xl"
                loading={isLoading}
              >
                Trimite link de resetare
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
        )}
      </Paper>
    </Center>
  );
};

export default ForgotPassword;
