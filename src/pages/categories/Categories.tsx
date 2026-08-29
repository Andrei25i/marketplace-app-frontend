import { Title, Text, Box, SimpleGrid, Center, Loader } from "@mantine/core";
import { useCategories } from "@/hooks/categories/useCategories";
import { getCategoryIcon } from "@/utils/categoryIconMapper.util";
import RequestErrorAlert from "@/components/ui/RequestErrorAlert";
import CategoryCard from "@/components/ui/CategoryCard";

const Categories = () => {
  const { categories, isLoading, error, refetch } = useCategories();

  return (
    <Box pt={20} pb={60}>
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
        <Center mih={260} style={{ width: "100%" }}>
          <Loader color="primary" size="lg" />
        </Center>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {categories.map((category) => {
            return (
              <CategoryCard
                key={category.id}
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

export default Categories;
