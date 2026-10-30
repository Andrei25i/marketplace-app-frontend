import FavoriteButton from "@/components/ui/cards/FavoriteButton";
import useStartConversation from "@/hooks/chat/useStartConversation";
import { useAuthStore } from "@/store/useAuthStore";
import type { AdDetailsDTO } from "@/types/ads.type";
import { formatPrice } from "@/utils/format.util";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconMapPin, IconMessage, IconPhone } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type AdDetailsCardProps = {
  ad: AdDetailsDTO;
};

const AdDetailsCard = ({ ad }: AdDetailsCardProps) => {
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

  const user = useAuthStore((state) => state.user);
  const isOwner = Boolean(user && String(user.id) === String(ad.user.id));
  const { startConversation, isStarting } = useStartConversation();

  return (
    <Card withBorder p={{ base: "md", sm: "xl" }}>
      <Stack gap="xs">
        <Group justify="space-between" mb="xs">
          <Button
            variant="filled"
            color="primary.2"
            c="primary.6"
            size="compact-xs"
            radius="xl"
            component={Link}
            to={`/search?category=${ad.category.id}`}
            fw={700}
            style={{
              cursor: "pointer",
            }}
          >
            {ad.category.name}
          </Button>
          <FavoriteButton adId={ad.id} variant="subtle" />
        </Group>

        <Title order={1} size="h3" lineClamp={2}>
          {ad.title}
        </Title>

        <Group gap="sm" justify="space-between" wrap="wrap">
          <Group gap={5}>
            <IconMapPin size={16} color="var(--mantine-color-dimmed)" />

            <Text size="sm" fw={500} c="dimmed">
              {ad.city}
            </Text>
          </Group>

          <Text size="sm" fw={500} c="dimmed">
            {new Date(ad.created_at).toLocaleDateString("ro-RO")}
          </Text>
        </Group>

        <Text size="24px" fw={700} c="primary" mt="xs" mb="sm">
          {formatPrice(ad.price)} {ad.currency}
        </Text>

        <Stack gap="xs" pt="xs">
          {!isOwner && (
            <Button
              size="md"
              radius="md"
              leftSection={<IconMessage size={18} />}
              loading={isStarting}
              onClick={() =>
                startConversation(String(ad.user.id), {
                  id: ad.id,
                  title: ad.title,
                })
              }
            >
              Trimite mesaj
            </Button>
          )}

          <Button
            size="md"
            radius="md"
            variant="default"
            leftSection={<IconPhone size={18} />}
            onClick={() => setIsPhoneVisible((prev) => !prev)}
          >
            {isPhoneVisible ? ad.phone_number : "Arată numărul de telefon"}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default AdDetailsCard;
