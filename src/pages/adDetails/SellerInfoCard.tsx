import RatingStars from "@/components/ui/feedback/RatingStars";
import type { AdDetailsDTO } from "@/types/ads.type";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { IconShoppingBag } from "@tabler/icons-react";
import { Link } from "react-router-dom";

type SellerInfoCardProps = {
  ad: AdDetailsDTO;
};

const SellerInfoCard = ({ ad }: SellerInfoCardProps) => {
  const sellerName = `${ad.user.first_name} ${ad.user.last_name}`;
  const initials =
    `${ad.user.first_name[0]}${ad.user.last_name[0]}`.toUpperCase();

  return (
    <Card withBorder p={{ base: "md", sm: "xl" }} mt="md">
      <Stack gap="md">
        <Flex
          justify="space-between"
          align={{ base: "center", xs: "flex-start" }}
          direction={{ base: "column", xs: "row" }}
          gap="md"
        >
          <Link
            to={`/user/${ad.user.id}`}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
          >
            <Group gap="md">
              <Avatar size={46} radius="xl" color="primary.2" c="primary.6">
                {initials}
              </Avatar>

              <Stack gap={2}>
                <Text fw={700} size="lg">
                  {sellerName}
                </Text>

                <RatingStars score={4.5} reviewCount={126} />
              </Stack>
            </Group>
          </Link>

          <Badge
            variant="light"
            color="primary.2"
            c="primary.6"
            radius="sm"
            size="sm"
            leftSection={<IconShoppingBag size={14} />}
          >
            Vânzător
          </Badge>
        </Flex>

        <Divider />

        <Button
          component={Link}
          to={`/search?user_id=${encodeURIComponent(ad.user.id)}`}
          variant="default"
          fullWidth
        >
          Vezi toate anunțurile
        </Button>
      </Stack>
    </Card>
  );
};

export default SellerInfoCard;
