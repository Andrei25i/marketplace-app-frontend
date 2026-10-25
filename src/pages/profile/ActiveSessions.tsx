import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ActionIcon,
  Alert,
  Anchor,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconLogout,
  IconShieldLock,
} from "@tabler/icons-react";
import { useActiveSessions } from "@/hooks/auth/useActiveSessions";
import type { ActiveSession } from "@/types/auth.type";
import { formatFullDate, formatRelativeTime } from "@/utils/relativeTime.util";

const isMobile = (os: string) => os === "Android" || os === "iOS";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Text size="xs" fw={700} c="dimmed" tt="uppercase">
    {children}
  </Text>
);

interface SessionRowProps {
  session: ActiveSession;
  action?: React.ReactNode;
}

const SessionRow = ({ session, action }: SessionRowProps) => {
  const DeviceIcon = isMobile(session.os)
    ? IconDeviceMobile
    : IconDeviceDesktop;

  const activity = session.is_current
    ? "Activ acum"
    : `Activ ${formatRelativeTime(session.last_used_at)}`;

  const meta = [
    `Conectat pe ${formatFullDate(session.created_at)}`,
    session.ip ? `IP ${session.ip}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Group justify="space-between" wrap="nowrap" align="flex-start" py="xs">
      <Group wrap="nowrap" gap="sm" align="flex-start" style={{ minWidth: 0 }}>
        <ThemeIcon
          variant="light"
          size="lg"
          radius="md"
          color={session.is_current ? "green" : "gray"}
        >
          <DeviceIcon size={20} />
        </ThemeIcon>

        <Stack gap={2} style={{ minWidth: 0 }}>
          <Text fw={600} size="sm">
            {session.os}
          </Text>
          <Text size="xs" c={session.is_current ? "green" : "dimmed"}>
            {session.browser} · {activity}
          </Text>
          <Text size="xs" c="dimmed">
            {meta}
          </Text>
        </Stack>
      </Group>

      {action}
    </Group>
  );
};

const ActiveSessions = () => {
  const { sessionsQuery, revokeOne, revokeOthers } = useActiveSessions();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const sessions = sessionsQuery.data ?? [];
  const current = sessions.find((s) => s.is_current);
  const others = sessions.filter((s) => !s.is_current);

  const handleRevokeOne = (session: ActiveSession) => {
    revokeOne.mutate(session.id, {
      onSuccess: () =>
        notifications.show({
          message: `${session.os} (${session.browser}) a fost deconectat.`,
          color: "green",
        }),
    });
  };

  const handleRevokeOthers = () => {
    revokeOthers.mutate(undefined, {
      onSuccess: () => {
        setConfirmOpen(false);
        notifications.show({
          message: "Celelalte dispozitive au fost deconectate.",
          color: "green",
        });
      },
    });
  };

  return (
    <Center py="xl">
      <Paper
        withBorder
        radius="lg"
        p={{ base: "md", md: "xl" }}
        w="100%"
        maw={560}
        shadow="sm"
      >
        <Stack align="center" mb="xl" gap="xs">
          <ThemeIcon size={64} mb="sm">
            <IconShieldLock size={32} />
          </ThemeIcon>
          <Title ta="center" order={1} size="h3">
            Sesiuni active
          </Title>
          <Text ta="center" c="dimmed" size="sm">
            Nu recunoști un dispozitiv? Deconectează-l și{" "}
            <Anchor component={Link} to="/profile/password" size="sm">
              schimbă-ți parola
            </Anchor>
            .
          </Text>
        </Stack>

        {sessionsQuery.isLoading && (
          <Center py="lg">
            <Loader />
          </Center>
        )}

        {sessionsQuery.isError && (
          <Alert color="red" icon={<IconAlertCircle size={18} />}>
            Sesiunile nu au putut fi încărcate.
          </Alert>
        )}

        {sessionsQuery.isSuccess && (
          <Stack gap="lg">
            {current && (
              <Stack gap={4}>
                <SectionLabel>Dispozitivul acesta</SectionLabel>
                <SessionRow session={current} />
              </Stack>
            )}

            <Stack gap={4}>
              <Group justify="space-between">
                <SectionLabel>Alte dispozitive ({others.length})</SectionLabel>
                {others.length > 0 && (
                  <Button
                    size="compact-xs"
                    variant="subtle"
                    color="red"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Deconectează tot
                  </Button>
                )}
              </Group>

              {others.length === 0 ? (
                <Text size="sm" c="dimmed" py="xs">
                  Nu ești conectat pe alte dispozitive.
                </Text>
              ) : (
                others.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    action={
                      <Tooltip label="Deconectează">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          aria-label={`Deconectează ${session.os} (${session.browser})`}
                          loading={
                            revokeOne.isPending &&
                            revokeOne.variables === session.id
                          }
                          onClick={() => handleRevokeOne(session)}
                        >
                          <IconLogout size={18} />
                        </ActionIcon>
                      </Tooltip>
                    }
                  />
                ))
              )}
            </Stack>
          </Stack>
        )}
      </Paper>

      <Modal
        opened={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Deconectezi celelalte dispozitive?"
        centered
      >
        <Text size="sm" mb="lg" mt="md">
          Vei fi deconectat de pe{" "}
          {others.length === 1
            ? "un dispozitiv"
            : `${others.length} dispozitive`}
          . Rămâi conectat doar pe acesta.
        </Text>
        <Group justify="flex-end">
          <Button
            variant="subtle"
            color="gray"
            onClick={() => setConfirmOpen(false)}
          >
            Anulează
          </Button>
          <Button
            color="red"
            loading={revokeOthers.isPending}
            onClick={handleRevokeOthers}
          >
            Deconectează
          </Button>
        </Group>
      </Modal>
    </Center>
  );
};

export default ActiveSessions;
