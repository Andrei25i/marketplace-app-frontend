import BackButton from "@/components/navigation/BackButton";
import SortingFilter from "@/components/ui/filters/SortingFilter";
import { SearchResults } from "@/components/ui/SearchResults";
import useFavoriteAds from "@/hooks/ads/useFavoriteAds";
import { useSearchFilters } from "@/hooks/search/useSearchFilters";
import { FAVORITE_AD_SORT_OPTIONS } from "@/types/ads.type";
import {
  Badge,
  Box,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const FavoriteAds = () => {
  const { filters, page, updateFilters, updatePage } = useSearchFilters();
  const { ads, isLoading, error, refetch } = useFavoriteAds(filters);
  const { ads: allFavoriteAds, isLoading: isCountLoading } = useFavoriteAds({
    sort: "date_desc",
  });
  const [searchQuery, setSearchQuery] = useState(filters.search ?? "");

  useEffect(() => {
    setSearchQuery(filters.search ?? "");
  }, [filters.search]);

  return (
    <>
      <BackButton />

      <Stack gap="lg" pb={60}>
        <Group
          mt="md"
          mb="lg"
          justify="space-between"
          align="center"
          wrap="wrap"
        >
          <Title order={1} size="h3">
            Anunțurile favorite
          </Title>

          {!isCountLoading && (
            <Badge variant="light" color="primary.2" c="primary.6">
              {allFavoriteAds.length}{" "}
              {allFavoriteAds.length === 1
                ? "anunț salvat"
                : "anunțuri salvate"}
            </Badge>
          )}
        </Group>

        <Group align="end" gap="md" wrap="wrap" mb="md">
          <Stack gap="xs" w={{ base: "100%", sm: 360, md: 420 }}>
            <Text fw={700} size="xs" c="dimmed" tt="uppercase">
              Caută
            </Text>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                updateFilters({
                  ...filters,
                  search: searchQuery.trim() || undefined,
                });
              }}
            >
              <TextInput
                placeholder="Caută în anunțurile favorite..."
                value={searchQuery}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setSearchQuery(value);

                  if (value === "" && filters.search) {
                    updateFilters({
                      ...filters,
                      search: undefined,
                    });
                  }
                }}
                leftSection={<IconSearch size={18} />}
              />
            </form>
          </Stack>

          <Box w={{ base: "100%", sm: 360, md: 420 }}>
            <SortingFilter
              options={FAVORITE_AD_SORT_OPTIONS}
              value={filters.sort}
              onChange={(sort) =>
                updateFilters({
                  ...filters,
                  sort,
                })
              }
            />
          </Box>
        </Group>

        <SearchResults
          ads={ads}
          isLoading={isLoading}
          error={error}
          page={page}
          onPageChange={updatePage}
          onRetry={refetch}
          cols={{ base: 2, sm: 3, lg: 4 }}
        />
      </Stack>
    </>
  );
};

export default FavoriteAds;
