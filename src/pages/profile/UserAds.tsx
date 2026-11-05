import BackButton from "@/components/navigation/BackButton";
import SortingFilter from "@/components/ui/filters/SortingFilter";
import { SearchResults } from "@/components/ui/SearchResults";
import useAds from "@/hooks/ads/useAds";
import usePublicUser from "@/hooks/auth/usePublicUser";
import { useSearchFilters } from "@/hooks/search/useSearchFilters";
import {
  Badge,
  Box,
  Group,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const UserAds = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isUserLoading } = usePublicUser(id);
  const { filters, page, updateFilters, updatePage } = useSearchFilters();
  const { ads, isLoading, isRefreshing, error, refetch } = useAds({
    ...filters,
    userId: id,
  });
  const { ads: allUserAds, isLoading: isCountLoading } = useAds({
    userId: id,
    sort: "date_desc",
  });

  const searchFromUrl = filters.search ?? "";
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [prevSearchFromUrl, setPrevSearchFromUrl] = useState(searchFromUrl);

  if (searchFromUrl !== prevSearchFromUrl) {
    setPrevSearchFromUrl(searchFromUrl);
    setSearchQuery(searchFromUrl);
  }

  const title = user
    ? `Anunțurile lui ${user.first_name} ${user.last_name}`
    : " Anunțurile utilizatorului";

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
          {isUserLoading ? (
            <Skeleton width={300} maw="100%" radius="sm">
              <Title order={1} size="h3">
                &nbsp;
              </Title>
            </Skeleton>
          ) : (
            <Title order={1} size="h3">
              {title}
            </Title>
          )}

          {isCountLoading ? (
            <Skeleton height={20} width={110} radius="xl" />
          ) : (
            <Badge variant="light" color="primary.2" c="primary.6">
              {allUserAds.length}{" "}
              {allUserAds.length === 1 ? "anunț activ" : "anunțuri active"}
            </Badge>
          )}
        </Group>

        <Group align="end" gap="md" wrap="wrap" mb="md">
          <Stack gap="xs" w={{ base: "100%", sm: 360, md: 420 }}>
            <Text fw={700} size="xs" c="dimmed" tt="uppercase">
              Caută
            </Text>

            <form
              onSubmit={(e) => {
                e.preventDefault();

                updateFilters({
                  ...filters,
                  search: searchQuery.trim() || undefined,
                });
              }}
            >
              <TextInput
                placeholder="Caută în anunțurile utilizatorului..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.currentTarget.value;
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
              value={filters.sort}
              onChange={(sort) =>
                updateFilters({
                  ...filters,
                  sort: sort ?? undefined,
                })
              }
            />
          </Box>
        </Group>

        <SearchResults
          ads={ads}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
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

export default UserAds;
