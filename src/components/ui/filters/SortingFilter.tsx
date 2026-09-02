import { AD_SORT_OPTIONS, type AdSortOption } from "@/types/ads.type";
import { Select, Stack, Text } from "@mantine/core";
import { IconArrowsSort } from "@tabler/icons-react";

type SortingFilterProps = {
  value?: AdSortOption;
  onChange?: (value: string | null) => void;
};

const SortingFilter = ({
  value = "date_desc",
  onChange,
}: SortingFilterProps) => {
  return (
    <Stack gap="xs">
      <Text fw={700} size="xs" c="dimmed" tt="uppercase">
        Sortează
      </Text>

      <Select
        value={value}
        data={AD_SORT_OPTIONS}
        onChange={(nextValue) =>
          onChange?.((nextValue as AdSortOption) || undefined)
        }
        leftSection={<IconArrowsSort size={18} />}
        comboboxProps={{ withinPortal: false }}
      />
    </Stack>
  );
};

export default SortingFilter;
