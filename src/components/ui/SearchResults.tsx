import type { AdDTO } from "@/types/ads.type";
import RequestErrorAlert from "./feedback/RequestErrorAlert";
import { Center, Loader } from "@mantine/core";
import EmptyResults from "./feedback/EmptyResults";
import PaginatedGrid from "./PaginatedGrid";
import AdCard from "./cards/AdCard";

type GridColumns = {
  base?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

interface SearchResultsProps {
  ads: AdDTO[];
  isLoading: boolean;
  error: string | null;
  page: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  cols?: GridColumns;
}

export const SearchResults = ({
  ads,
  isLoading,
  error,
  page,
  onPageChange,
  onRetry,
  cols = { base: 2, md: 3 },
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
      cols={cols}
      renderItem={(ad) => <AdCard key={ad.id} ad={ad} />}
    />
  );
};
