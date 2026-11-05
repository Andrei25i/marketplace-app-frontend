import CategoryCard from "@/components/ui/cards/CategoryCard";
import CategoryCardSkeleton from "@/components/ui/cards/CategoryCardSkeleton";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import { Stagger, StaggerItem } from "@/components/ui/motion/Stagger";
import { useCategories } from "@/hooks/categories/useCategories";
import { getCategoryIcon } from "@/utils/categoryIconMapper.util";
import { Anchor, Box, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const GRID_COLS = { base: 2, sm: 3, lg: 6 };
const CATEGORY_COUNT = 6;

const CategoriesSection = () => {
  const { categories, isLoading, error, refetch } = useCategories({
    limit: CATEGORY_COUNT,
  });

  return (
    <Box component="section">
      <Box mb="lg">
        <Group justify="space-between" align="center">
          <Title order={2} size="h3" fw={600}>
            Categorii
          </Title>

          <Anchor
            component={Link}
            to="/categories"
            c="primary"
            fw={600}
            size="sm"
            style={{ display: "flex", alignItems: "center", gap: 4 }}
            underline="hover"
          >
            Vezi tot <IconChevronRight size={16} />
          </Anchor>
        </Group>

        <Text c="dimmed" mt={4} size="sm">
          Răsfoiește anunțurile pe categorii.
        </Text>
      </Box>

      {error ? (
        <RequestErrorAlert compact message={error} onRetry={() => refetch()} />
      ) : isLoading ? (
        <SimpleGrid
          cols={GRID_COLS}
          spacing="md"
          role="status"
          aria-label="Se încarcă categoriile"
          aria-busy
        >
          {Array.from({ length: CATEGORY_COUNT }, (_, index) => (
            <CategoryCardSkeleton key={index} compact />
          ))}
        </SimpleGrid>
      ) : (
        <Stagger>
          <SimpleGrid cols={GRID_COLS} spacing="md">
            {categories.map((category) => (
              <StaggerItem key={category.id}>
                <CategoryCard
                  compact
                  category={category}
                  icon={getCategoryIcon(category.name)}
                />
              </StaggerItem>
            ))}
          </SimpleGrid>
        </Stagger>
      )}
    </Box>
  );
};

export default CategoriesSection;
