import AdCard from "@/components/ui/cards/AdCard";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import FiltersPanel from "@/components/ui/filters/FiltersPanel";
import PaginatedGrid from "@/components/ui/PaginatedGrid";
import useAds from "@/hooks/ads/useAds";
import { Box, Center, Loader, Stack, Text, Title } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import type { GetAdsFilters } from "@/types/ads.type";
import EmptyResults from "@/components/ui/feedback/EmptyResults";
import {
  parseFiltersFromUrl,
  parsePageFromUrl,
  updateUrlWithFilters,
} from "@/utils/searchFilters.util";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = parseFiltersFromUrl(searchParams);
  const page = parsePageFromUrl(searchParams);
  const query = filters.search ?? "";

  const handleFiltersChange = (nextFilters: GetAdsFilters) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = updateUrlWithFilters(currentParams, nextFilters);

        nextParams.delete("page");
        return nextParams;
      },
      { replace: true },
    );
  };

  const handlePageChange = (nextPage: number) => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);

        if (nextPage === 1) {
          nextParams.delete("page");
        } else {
          nextParams.set("page", String(nextPage));
        }

        return nextParams;
      },
      { replace: true },
    );
  };

  const { ads, isLoading, error, refetch } = useAds(filters);

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
          <FiltersPanel value={filters} onChange={handleFiltersChange} />

          <Box style={{ flex: 1, minWidth: 280 }}>
            {error ? (
              <RequestErrorAlert
                message={error}
                onRetry={() => void refetch()}
              />
            ) : isLoading ? (
              <Center mih={260}>
                <Loader color="primary" size="lg" />
              </Center>
            ) : ads.length === 0 ? (
              <EmptyResults />
            ) : (
              <PaginatedGrid
                items={ads}
                itemsPerPage={6}
                page={page}
                onPageChange={handlePageChange}
                cols={{ base: 1, sm: 2, lg: 3 }}
                renderItem={(ad) => <AdCard key={ad.id} ad={ad} />}
              />
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default Search;
