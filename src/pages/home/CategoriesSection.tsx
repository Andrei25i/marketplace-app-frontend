import CategoryCard from "@/components/ui/cards/CategoryCard";
import RequestErrorAlert from "@/components/ui/feedback/RequestErrorAlert";
import { useCategories } from "@/hooks/categories/useCategories";
import { getCategoryIcon } from "@/utils/categoryIconMapper.util";
import {
  Anchor,
  Box,
  Center,
  Group,
  Loader,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const CategoriesSection = () => {
  const { categories, isLoading, error, refetch } = useCategories({ limit: 6 });

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
        <Center mih={50}>
          <Loader color="primary" size="sm" />
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
          {categories.map((category) => {
            return (
              <CategoryCard
                key={category.id}
                compact
                category={category}
                icon={getCategoryIcon(category.name)}
              />
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default CategoriesSection;
