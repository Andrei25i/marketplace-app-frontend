import FiltersPanel from "@/components/ui/filters/FiltersPanel";
import useAds from "@/hooks/ads/useAds";
import { Box, Button, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { IconAdjustments } from "@tabler/icons-react";
import { FiltersDrawer } from "@/components/ui/filters/FiltersDrawer";
import { SearchResults } from "@/components/ui/SearchResults";
import { useSearchFilters } from "@/hooks/search/useSearchFilters";

const Search = () => {
  const { filters, page, updateFilters, updatePage } = useSearchFilters();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { ads, isLoading, error, refetch } = useAds(filters);
  const query = filters.search ?? "";

  return (
    <Box pb={60}>
      <Stack gap="lg">
        <Box>
          <Title order={1} size={"h3"}>
            Rezultate
          </Title>

          <Text c="dimmed" size="sm">
            {query
              ? `Pentru căutarea „${query}”`
              : "Toate anunțurile disponibile"}
          </Text>
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
          {!isMobile && (
            <FiltersPanel value={filters} onChange={updateFilters} />
          )}

          {isMobile && (
            <Button
              variant="default"
              leftSection={<IconAdjustments size={16} />}
              onClick={() => setIsDrawerOpen(true)}
              fullWidth
            >
              Filtre
            </Button>
          )}

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
