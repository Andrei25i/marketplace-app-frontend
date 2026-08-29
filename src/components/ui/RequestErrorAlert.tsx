import { Box, Button, Center, ThemeIcon, Title, Text } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";

type RequestErrorAlertProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
};

const RequestErrorAlert = ({
  title = "A apărut o eroare",
  message = "Nu am putut încărca datele în acest moment.",
  onRetry,
  retryLabel = "Reîncearcă",
}: RequestErrorAlertProps) => {
  return (
    <Center>
      <Box ta="center" style={{ width: "100%" }}>
        <ThemeIcon size={84} mb="lg">
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
            color="primary"
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
