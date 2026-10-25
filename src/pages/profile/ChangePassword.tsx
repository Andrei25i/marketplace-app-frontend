import { useChangePasswordForm } from "@/hooks/auth/useChangePasswordForm";
import {
  Alert,
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconDeviceFloppy,
  IconKey,
  IconLock,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const ChangePassword = () => {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    isLoading,
    handleSubmit,
  } = useChangePasswordForm();

  return (
    <Center mih={{ base: "auto", sm: "80vh" }}>
      <Paper
        withBorder
        radius="lg"
        p={{ base: "md", md: "xl" }}
        w="100%"
        maw={480}
        shadow="sm"
      >
        <Stack align="center" mb={40} gap="xs">
          <ThemeIcon size={64} mb="sm">
            <IconKey size={32} />
          </ThemeIcon>
          <Title ta="center" order={1} size="h3">
            Schimbă parola
          </Title>
          <Text ta="center" c="dimmed" size="sm">
            După schimbare, vei fi deconectat de pe celelalte dispozitive.
          </Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <PasswordInput
              label="Parola actuală"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.currentTarget.value)}
              leftSection={<IconLock size={18} />}
              autoComplete="current-password"
              withAsterisk
            />
            <PasswordInput
              label="Parola nouă"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.currentTarget.value)}
              leftSection={<IconLock size={18} />}
              autoComplete="new-password"
              withAsterisk
            />
            <PasswordInput
              label="Confirmă parola nouă"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              leftSection={<IconLock size={18} />}
              autoComplete="new-password"
              withAsterisk
            />

            {error && (
              <Alert
                color="red"
                icon={<IconAlertCircle size={18} />}
                radius="md"
              >
                {error}
              </Alert>
            )}

            <Group justify="flex-end" gap="sm" mt="sm">
              <Button
                component={Link}
                to="/profile"
                variant="subtle"
                color="gray"
                disabled={isLoading}
              >
                Anulează
              </Button>
              <Button
                type="submit"
                color="primary"
                leftSection={<IconDeviceFloppy size={18} />}
                loading={isLoading}
              >
                Salvează
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};

export default ChangePassword;
