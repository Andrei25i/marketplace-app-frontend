import type { AdSortOption, GetAdsFilters } from "@/types/ads.type";
import { ActionIcon, Card, Group, Stack, Title } from "@mantine/core";
import CategoryFilter from "./CategoryFilter";
import PriceRangeFilter from "./PriceRangeFilter";
import LocationFilter from "./LocationFilter";
import SortingFilter from "./SortingFilter";
import { IconFilterOff } from "@tabler/icons-react";
import { DEFAULT_AD_FILTERS } from "@/utils/searchFilters.util";

type FiltersPanelVariant = "sidebar" | "drawer";

type FiltersPanelProps = {
  value?: GetAdsFilters;
  onChange?: (filters: GetAdsFilters) => void;
  variant?: FiltersPanelVariant;
};

const FiltersPanel = ({
  value = DEFAULT_AD_FILTERS,
  onChange,
  variant = "sidebar",
}: FiltersPanelProps) => {
  const updateFilter = <K extends keyof GetAdsFilters>(
    key: K,
    nextValue: GetAdsFilters[K],
  ) => {
    onChange?.({
      ...value,
      [key]: nextValue,
    });
  };

  const resetFilters = () => {
    onChange?.({ ...DEFAULT_AD_FILTERS, search: value.search });
  };

  const handlePriceChange = ({
    minPrice,
    maxPrice,
  }: {
    minPrice?: string;
    maxPrice?: string;
  }) => {
    onChange?.({
      ...value,
      minPrice,
      maxPrice,
    });
  };

  const content = (
    <Stack gap="lg" p="lg">
      <Group justify="space-between">
        {variant === "sidebar" && (
          <Title order={3} size="h5">
            Filtre
          </Title>
        )}

        {variant === "sidebar" && (
          <ActionIcon
            variant="subtle"
            color="primary.6"
            radius="md"
            onClick={resetFilters}
          >
            <IconFilterOff size={18} />
          </ActionIcon>
        )}
      </Group>

      <CategoryFilter
        value={value.category}
        onChange={(nextCategory) => updateFilter("category", nextCategory)}
        searchable={variant === "sidebar"}
      />

      <PriceRangeFilter
        minPrice={value.minPrice}
        maxPrice={value.maxPrice}
        onChange={handlePriceChange}
      />

      <LocationFilter
        value={value.city ?? ""}
        onChange={(nextCity) => updateFilter("city", nextCity || undefined)}
        searchable={variant === "sidebar"}
      />

      <SortingFilter
        value={value.sort ?? "date_desc"}
        onChange={(nextSort) =>
          updateFilter("sort", (nextSort as AdSortOption) ?? "date_desc")
        }
      />
    </Stack>
  );

  if (variant === "drawer") {
    return content;
  }

  return (
    <Card w="100%" h="fit-content" p={0} maw={290} withBorder>
      {content}
    </Card>
  );
};

export default FiltersPanel;
