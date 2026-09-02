import AdCard from "@/components/ui/cards/AdCard";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import useAds from "@/hooks/ads/useAds";
import type { GetAdsFilters } from "@/types/ads.type";
import {
  Anchor,
  Box,
  Center,
  Flex,
  Group,
  Loader,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const RecentlySection = () => {
  const filters = useMemo<GetAdsFilters>(() => ({ sort: "date_desc" }), []);
  const { ads, isLoading, error, refetch } = useAds(filters, { limit: 5 });

  return (
    <Box component="section">
      <Box mb="lg">
        <Group justify="space-between" align="center">
          <Title order={2} size="h3" fw={600}>
            Adăugate recent
          </Title>

          <Anchor
            component={Link}
            to="/search?sort=date_desc"
            c="primary"
            fw={600}
            size="sm"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            underline="hover"
          >
            Vezi mai multe <IconChevronRight size={16} />
          </Anchor>
        </Group>

        <Text c="dimmed" mt={4} size="sm">
          Discoperă cele mai noi anunțuri.
        </Text>
      </Box>

      {error ? (
        <RequestErrorAlert compact message={error} onRetry={() => refetch()} />
      ) : isLoading ? (
        <Center mih={50}>
          <Loader color="primary" size="sm" />
        </Center>
      ) : (
        <ScrollArea type="hover" scrollbarSize={10} offsetScrollbars pb="md">
          <Flex gap={{ base: "md", md: "lg", lg: 25 }} wrap="nowrap" pb="md">
            {ads.map((ad) => (
              <Box
                key={ad.id}
                w={{
                  base: 230,
                  xs: 300,
                  sm: 320,
                  md: 350,
                }}
                style={{
                  flexGrow: 1,
                  flexShrink: 0,
                }}
              >
                <AdCard ad={ad} />
              </Box>
            ))}
          </Flex>
        </ScrollArea>
      )}
    </Box>
  );
};

export default RecentlySection;
