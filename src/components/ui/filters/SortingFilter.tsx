import { AD_SORT_OPTIONS, type AdSortOption } from "@/types/ads.type";
import { Select, Stack, Text } from "@mantine/core";
import { IconArrowsSort } from "@tabler/icons-react";

type SortingFilterProps = {
  options?: ReadonlyArray<{
    value: AdSortOption;
    label: string;
  }>;
  value?: AdSortOption;
  onChange?: (value: AdSortOption | undefined) => void;
};

const SortingFilter = ({
  options = AD_SORT_OPTIONS,
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
        data={options}
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
