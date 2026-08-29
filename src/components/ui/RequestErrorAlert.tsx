import {
  Box,
  Button,
  Center,
  ThemeIcon,
  Title,
  Text,
  Group,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";

type RequestErrorAlertProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
};

const RequestErrorAlert = ({
  title = "A apărut o eroare",
  message = "Nu am putut încărca datele în acest moment.",
  onRetry,
  retryLabel = "Reîncearcă",
  compact = false,
}: RequestErrorAlertProps) => {
  if (compact) {
    return (
      <Box
        p="sm"
        mt="sm"
        style={{
          border: "1px solid var(--mantine-color-red-2)",
          borderRadius: "12px",
          background: "var(--mantine-color-red-0)",
        }}
      >
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon color="red" c="red" variant="light" size={28}>
              <IconAlertCircle size={16} />
            </ThemeIcon>

            <Text size="sm" fw={500} c="dark.6">
              {message}
            </Text>
          </Group>

          {onRetry && (
            <Button
              variant="light"
              color="red"
              c="red"
              size="compact-sm"
              leftSection={<IconRefresh size={14} />}
              onClick={onRetry}
            >
              {retryLabel}
            </Button>
          )}
        </Group>
      </Box>
    );
  }

  return (
    <Center>
      <Box ta="center" style={{ width: "100%" }}>
        <ThemeIcon color="red" c="red" size={84} mb="lg">
          <IconAlertCircle size={42} />
        </ThemeIcon>

        <Title order={2} mb="xs">
          {title}
        </Title>

        <Text c="dimmed" size="lg" mb="lg">
          {message}
        </Text>

        {onRetry && (
          <Button
            variant="light"
            color="red"
            c="red"
            size="md"
            leftSection={<IconRefresh size={18} />}
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        )}
      </Box>
    </Center>
  );
};

export default RequestErrorAlert;
