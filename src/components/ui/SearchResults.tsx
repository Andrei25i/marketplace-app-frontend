import type { AdDTO } from "@/types/ads.type";
import RequestErrorAlert from "./feedback/RequestErrorAlert";
import { Box, SimpleGrid } from "@mantine/core";
import EmptyResults from "./feedback/EmptyResults";
import PaginatedGrid from "./PaginatedGrid";
import AdCard from "./cards/AdCard";
import AdCardSkeleton from "./cards/AdCardSkeleton";

const SKELETON_COUNT = 8;

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
  isRefreshing?: boolean;
  error: string | null;
  page: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  cols?: GridColumns;
}

export const SearchResults = ({
  ads,
  isLoading,
  isRefreshing = false,
  error,
  page,
  onPageChange,
  onRetry,
  cols = { base: 2, md: 3, xl: 4 },
}: SearchResultsProps) => {
  if (error) return <RequestErrorAlert message={error} onRetry={onRetry} />;
  if (isLoading)
    return (
      <SimpleGrid
        cols={cols}
        spacing="sm"
        role="status"
        aria-label="Se încarcă anunțurile"
        aria-busy
      >
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <AdCardSkeleton key={index} />
        ))}
      </SimpleGrid>
    );
  return (
    <Box
      aria-busy={isRefreshing}
      style={{
        opacity: isRefreshing ? 0.55 : 1,
        transition: isRefreshing
          ? "opacity 150ms ease 120ms"
          : "opacity 150ms ease",
      }}
    >
      {ads.length === 0 ? (
        <EmptyResults />
      ) : (
        <PaginatedGrid
          items={ads}
          itemsPerPage={12}
          page={page}
          onPageChange={onPageChange}
          cols={cols}
          getItemKey={(ad) => ad.id}
          renderItem={(ad) => <AdCard key={ad.id} ad={ad} />}
        />
      )}
    </Box>
  );
};
