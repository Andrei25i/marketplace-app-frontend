import { Title, Text, Box, SimpleGrid } from "@mantine/core";
import { useCategories } from "@/hooks/categories/useCategories";
import { getCategoryIcon } from "@/utils/categoryIconMapper.util";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import CategoryCard from "@/components/ui/cards/CategoryCard";
import BackButton from "@/components/navigation/BackButton";
import CategoryCardSkeleton from "@/components/ui/cards/CategoryCardSkeleton";

const GRID_COLS = { base: 1, sm: 2, md: 3, lg: 4 };
const SKELETON_COUNT = 8;

const Categories = () => {
  const { categories, isLoading, error, refetch } = useCategories();

  return (
    <Box pt={10} pb={60}>
      <BackButton />

      <Box mb={40}>
        <Title
          order={1}
          mb="xs"
          style={{
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            lineHeight: 1.2,
          }}
        >
          Explorează Categoriile
        </Title>

        <Text c="dimmed" size="lg" mb="xs">
          Găsește rapid ceea ce cauți navigând prin secțiunile noastre.
        </Text>
      </Box>

      {error ? (
        <RequestErrorAlert message={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <SimpleGrid
          cols={GRID_COLS}
          spacing="lg"
          role="status"
          aria-label="Se încarcă categoriile"
          aria-busy
        >
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid cols={GRID_COLS} spacing="lg">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              icon={getCategoryIcon(category.name)}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default Categories;
