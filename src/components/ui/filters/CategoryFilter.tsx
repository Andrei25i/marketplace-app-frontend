import { useCategories } from "@/hooks/categories/useCategories";
import { Select, Stack, Text } from "@mantine/core";
import { IconCategory } from "@tabler/icons-react";

type CategoryFilterProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
  searchable?: boolean;
};

const CategoryFilter = ({
  value,
  onChange,
  searchable = true,
}: CategoryFilterProps) => {
  const { categories, isLoading, error } = useCategories();

  const data = categories.map((category) => ({
    value: String(category.id),
    label: category.name,
  }));

  return (
    <Stack gap="xs">
      <Text fw={700} size="xs" c="dimmed" tt="uppercase">
        Categorie
      </Text>

      <Select
        searchable={searchable}
        clearable
        nothingFoundMessage={
          error ? "Eroare la încărcare" : "Nicio categorie găsită"
        }
        disabled={isLoading}
        placeholder={isLoading ? "Se încarcă..." : "Toate"}
        value={value ?? null}
        onChange={(nextValue) => onChange?.(nextValue || undefined)}
        data={data}
        leftSection={<IconCategory size={18} />}
        comboboxProps={{ withinPortal: false }}
      />
    </Stack>
  );
};

export default CategoryFilter;
