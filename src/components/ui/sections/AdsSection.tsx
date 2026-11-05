import AdCard from "@/components/ui/cards/AdCard";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import type { AdDTO } from "@/types/ads.type";
import {
  Anchor,
  Box,
  Card,
  Flex,
  Group,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import AdCardSkeleton from "../cards/AdCardSkeleton";
import { Stagger, StaggerItem } from "../motion/Stagger";

const CARD_WIDTH = { base: 230, xs: 300, sm: 320, md: 350 };

const AdsRow = ({ children }: { children: ReactNode }) => (
  <ScrollArea type="hover" scrollbarSize={10} offsetScrollbars>
    <Flex gap={{ base: "md", md: "lg", lg: 25 }} wrap="nowrap" pb="lg">
      {children}
    </Flex>
  </ScrollArea>
);

const AdSlot = ({ children }: { children: ReactNode }) => (
  <Box w={CARD_WIDTH} style={{ flexShrink: 0 }}>
    {children}
  </Box>
);

type AdsSectionProps = {
  title: string;
  ads: AdDTO[];
  isLoading?: boolean;
  error?: string;
  onRetry?: () => void;
  description?: string;
  emptyMessage?: string;
  viewAllTo?: string;
  viewAllLabel?: string;
  hideWhenEmpty?: boolean;
  visibleAdsCount?: number;
};

const AdsSection = ({
  title,
  ads,
  isLoading = false,
  error = "",
  onRetry,
  description,
  emptyMessage,
  viewAllTo,
  viewAllLabel = "Vezi tot",
  hideWhenEmpty = false,
  visibleAdsCount = 5,
}: AdsSectionProps) => {
  const isEmpty = !isLoading && !error && ads.length === 0;
  const visibleAds = ads.slice(0, visibleAdsCount);
  const hasMoreAds = ads.length > visibleAdsCount;

  if (hideWhenEmpty && isEmpty) {
    return null;
  }

  return (
    <Box component="section">
      <Box mb="lg">
        <Group justify="space-between" align="center">
          <Title order={2} size="h3" fw={600}>
            {title}
          </Title>

          {viewAllTo && hasMoreAds && (
            <Anchor
              component={Link}
              to={viewAllTo}
              c="primary"
              fw={600}
              size="sm"
              style={{ display: "flex", alignItems: "center", gap: 4 }}
              underline="hover"
            >
              {viewAllLabel}
              <IconChevronRight size={16} />
            </Anchor>
          )}
        </Group>

        {description && (
          <Text c="dimmed" mt={4} size="sm">
            {description}
          </Text>
        )}
      </Box>

      {error ? (
        <RequestErrorAlert compact message={error} onRetry={onRetry} />
      ) : isLoading ? (
        <Box role="status" aria-label="Se încarcă anunțurile" aria-busy>
          <AdsRow>
            {Array.from({ length: visibleAdsCount }, (_, index) => (
              <AdSlot key={index}>
                <AdCardSkeleton />
              </AdSlot>
            ))}
          </AdsRow>
        </Box>
      ) : isEmpty ? (
        <Card
          p="sm"
          mt="sm"
          bg="#f1f5f5"
          style={{
            border: "1px solid var(--mantine-color-gray-2)",
          }}
        >
          <Text c="dimmed" size="sm">
            {emptyMessage}
          </Text>
        </Card>
      ) : (
        <Stagger>
          <AdsRow>
            {visibleAds.map((ad) => (
              <AdSlot key={ad.id}>
                <StaggerItem>
                  <AdCard ad={ad} />
                </StaggerItem>
              </AdSlot>
            ))}
          </AdsRow>
        </Stagger>
      )}
    </Box>
  );
};

export default AdsSection;
