import FiltersPanel from "@/components/ui/filters/FiltersPanel";
import useAds from "@/hooks/ads/useAds";
import { Box, Button, Indicator, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { IconAdjustments } from "@tabler/icons-react";
import { FiltersDrawer } from "@/components/ui/filters/FiltersDrawer";
import { SearchResults } from "@/components/ui/SearchResults";
import { useSearchFilters } from "@/hooks/search/useSearchFilters";
import SearchBar from "@/components/layout/SearchBar";

const Search = () => {
  const { filters, page, updateFilters, updatePage } = useSearchFilters();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { ads, isLoading, error, refetch } = useAds(filters);
  const query = filters.search ?? "";

  const activeFilterCount = [
    filters.category,
    filters.minPrice && Number(filters.minPrice) !== 0
      ? filters.minPrice
      : undefined,
    filters.maxPrice,
    filters.city,
  ].filter(Boolean).length;

  return (
    <Box pb={60}>
      <Box
        hiddenFrom="sm"
        style={{
          marginBottom: 15,
          paddingBottom: 20,
          borderBottom: "1px solid var(--mantine-color-gray-2",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <SearchBar />
      </Box>

      <Stack gap="lg">
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <Box style={{ flex: 1 }}>
            <Title order={1} size={"h3"}>
              Rezultate
            </Title>

            <Text c="dimmed" size="sm">
              {query
                ? `Pentru căutarea „${query}”`
                : "Toate anunțurile disponibile"}
            </Text>
          </Box>

          <Indicator
            hiddenFrom="sm"
            disabled={activeFilterCount === 0}
            label={activeFilterCount}
            size={16}
            color="primary"
            offset={4}
          >
            <Button
              hiddenFrom="sm"
              variant="default"
              size="xs"
              leftSection={<IconAdjustments size={16} />}
              onClick={() => setIsDrawerOpen(true)}
              style={{ marginTop: 2 }}
            >
              Filtre
            </Button>
          </Indicator>
        </Box>

        <Box
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <Box visibleFrom="sm">
            <FiltersPanel value={filters} onChange={updateFilters} />
          </Box>

          <Box style={{ flex: 1, minWidth: 280 }}>
            <SearchResults
              ads={ads}
              isLoading={isLoading}
              error={error}
              page={page}
              onPageChange={updatePage}
              onRetry={refetch}
            />
          </Box>
        </Box>
      </Stack>

      <FiltersDrawer
        opened={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        filters={filters}
        onApply={updateFilters}
      />
    </Box>
  );
};

export default Search;
