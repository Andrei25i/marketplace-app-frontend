import FavoriteButton from "@/components/ui/cards/FavoriteButton";
import type { AdDetailsDTO } from "@/types/ads.type";
import { formatPrice } from "@/utils/format.util";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type AdDetailsCardProps = {
  ad: AdDetailsDTO;
};

const AdDetailsCard = ({ ad }: AdDetailsCardProps) => {
  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

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
          <Button size="md" radius="md" leftSection={<IconMail size={18} />}>
            Trimite Mesaj
          </Button>

          <Button
            size="md"
            radius="md"
            variant="default"
            leftSection={<IconPhone size={18} />}
            onClick={() => setIsPhoneVisible((prev) => !prev)}
          >
            {isPhoneVisible ? ad.user.phone_number : "Arată numărul de telefon"}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default AdDetailsCard;
