import BackButton from "@/components/navigation/BackButton";
import SortingFilter from "@/components/ui/filters/SortingFilter";
import { SearchResults } from "@/components/ui/SearchResults";
import useAds from "@/hooks/ads/useAds";
import usePublicUser from "@/hooks/auth/usePublicUser";
import { useSearchFilters } from "@/hooks/search/useSearchFilters";
import {
  Badge,
  Box,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserAds = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isUserLoading } = usePublicUser(id);
  const { filters, page, updateFilters, updatePage } = useSearchFilters();
  const { ads, isLoading, error, refetch } = useAds({
    ...filters,
    userId: id,
  });
  const { ads: allUserAds } = useAds({
    userId: id,
    sort: "date_desc",
  });

  const [searchQuery, setSearchQuery] = useState(filters.search ?? "");

  useEffect(() => {
    setSearchQuery(filters.search ?? "");
  }, [filters.search]);

  if (isUserLoading) {
    return (
      <Center mih="60vh">
        <Loader color="primary"></Loader>
      </Center>
    );
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
          <Title order={1} size="h3">
            {title}
          </Title>

          <Badge variant="light" color="primary.2" c="primary.6">
            {allUserAds.length}{" "}
            {allUserAds.length === 1 ? "anunț activ" : "anunțuri active"}
          </Badge>
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
