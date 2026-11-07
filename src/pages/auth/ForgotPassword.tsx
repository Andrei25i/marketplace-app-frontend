import { useForgotPasswordForm } from "@/hooks/auth/useForgotPasswordForm";
import { fadeInUp } from "@/theme/motion";
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
import { AnimatePresence, motion } from "motion/react";
import { Form, Link } from "react-router-dom";

const ForgotPassword = () => {
  const {
    formRef,
    email,
    setEmail,
    fieldErrors,
    generalError,
    isLoading,
    isSent,
    handleSubmit,
  } = useForgotPasswordForm();

  return (
    <Center mih={{ base: "auto", sm: "80vh" }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "xl", lg: 48 }}
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

        <AnimatePresence mode="wait" initial={false}>
          {isSent ? (
            <motion.div
              key="sent"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Stack align="center">
                <Text ta="center" fw={500} c="green">
                  Verifică adresa de email
                </Text>
                <Text ta="center" c="dimmed" size="sm">
                  Dacă adresa <b>{email}</b> este asociată unui cont, vei primi
                  un link pentru resetarea parolei.
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
            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Form ref={formRef} onSubmit={handleSubmit} noValidate>
                <Stack gap="md">
                  <TextInput
                    label="Email"
                    placeholder="Adresa ta de email"
                    leftSection={<IconMail size={18} />}
                    type="email"
                    withAsterisk
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    error={fieldErrors.email}
                  />

                  {generalError && (
                    <Alert
                      variant="light"
                      color="red"
                      radius="md"
                      icon={<IconAlertCircle size={18} />}
                      mt="sm"
                      data-form-error
                    >
                      {generalError}
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
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </Center>
  );
};

export default ForgotPassword;
