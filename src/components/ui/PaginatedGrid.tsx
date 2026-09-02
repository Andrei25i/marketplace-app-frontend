import { Center, Pagination, SimpleGrid } from "@mantine/core";
import { useMemo } from "react";

type PaginatedGridProps<T> = {
  items: T[];
  itemsPerPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  cols?: {
    base?: number;
    sm?: number;
    lg?: number;
  };
};

const PaginatedGrid = <T,>({
  items,
  itemsPerPage = 6,
  page = 1,
  onPageChange,
  renderItem,
  cols = { base: 1, sm: 2, lg: 3 },
}: PaginatedGridProps<T>) => {
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const activePage = Math.min(page, totalPages);

  const currentItems = useMemo(() => {
    const start = (activePage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, activePage, itemsPerPage]);

  if (items.length === 0) return null;

  return (
    <>
      <SimpleGrid cols={cols} spacing="lg">
        {currentItems.map((item, index) => renderItem(item, index))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Center mt="lg">
          <Pagination
            total={totalPages}
            value={activePage}
            onChange={onPageChange}
            radius="md"
            size="sm"
          />
        </Center>
      )}
    </>
  );
};

export default PaginatedGrid;
