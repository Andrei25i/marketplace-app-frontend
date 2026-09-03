import type { AdDTO } from "@/types/ads.type";
import RequestErrorAlert from "./feedback/RequestErrorAlert";
import { Center, Loader } from "@mantine/core";
import EmptyResults from "./feedback/EmptyResults";
import PaginatedGrid from "./PaginatedGrid";
import AdCard from "./cards/AdCard";

interface SearchResultsProps {
  ads: AdDTO[];
  isLoading: boolean;
  error: string | null;
  page: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
}

export const SearchResults = ({
  ads,
  isLoading,
  error,
  page,
  onPageChange,
  onRetry,
}: SearchResultsProps) => {
  if (error) return <RequestErrorAlert message={error} onRetry={onRetry} />;
  if (isLoading)
    return (
      <Center mih={260}>
        <Loader color="primary" size="lg" />
      </Center>
    );
  if (ads.length === 0) return <EmptyResults />;

  return (
    <PaginatedGrid
      items={ads}
      itemsPerPage={6}
      page={page}
      onPageChange={onPageChange}
      cols={{ base: 2, md: 3 }}
      renderItem={(ad) => <AdCard key={ad.id} ad={ad} />}
    />
  );
};
