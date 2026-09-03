import { Card, Text, Group, Stack } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import classes from "./AdCard.module.css";
import type { AdDTO } from "@/types/ads.type";
import { Link } from "react-router-dom";
import { formatPrice, timeAgo } from "@/utils/format.util";
import FavoriteButton from "./FavoriteButton";
import { useMediaQuery } from "@mantine/hooks";

export interface AdCardProps {
  ad: AdDTO;
}

const AdCard = ({ ad }: AdCardProps) => {
  const isMobile = useMediaQuery("(max-width: 530px)");

  return (
    <Card
      component={Link}
      to={`/ads/${ad.id}`}
      withBorder
      radius="md"
      className={classes.card}
      padding={0}
    >
      <Card.Section className={classes.imageSection}>
        <img src={ad.images[0]?.url} alt={ad.title} className={classes.image} />

        <FavoriteButton adId={ad.id} />
      </Card.Section>

      <Stack gap="xs" p="xs" style={{ flexGrow: 1 }}>
        <Stack gap={4}>
          <Text fw={700} size="md" lineClamp={1} c="dark.8" lh="tight">
            {ad.title}
          </Text>

          <Text c="primary" fw={700} size="md">
            {formatPrice(ad.price)} {ad.currency}
          </Text>
        </Stack>

        <Text size="xs" c="dark.3" lineClamp={2}>
          {ad.description}
        </Text>

        <Group justify="space-between" align="center" mt="auto" wrap="nowrap">
          <Group gap={4} wrap="nowrap">
            <IconMapPin size={13} color="var(--mantine-color-dark-3)" />

            <Text size="xs" c="dark.3" truncate>
              {ad.city.split(", ")[1]}
            </Text>
          </Group>

          {!isMobile && (
            <Text size="xs" c="dark.3" style={{ whiteSpace: "nowrap" }}>
              {timeAgo(ad.created_at)}
            </Text>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

export default AdCard;
