import { Select, Stack, Text } from "@mantine/core";
import { IconMap } from "@tabler/icons-react";
import locationsData from "@/data/romanian_locations.json";

const countiesList = Object.keys(locationsData).sort();

type LocationFilterProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string | null) => void;
};

const LocationFilter = ({
  placeholder = "Selectează județul",
  value,
  onChange,
}: LocationFilterProps) => {
  return (
    <Stack gap="xs">
      <Text fw={700} size="xs" c="dimmed" tt="uppercase">
        Locație
      </Text>

      <Select
        searchable
        clearable
        placeholder={placeholder}
        data={countiesList}
        value={value || null}
        onChange={onChange}
        leftSection={<IconMap size={18} />}
      />
    </Stack>
  );
};

export default LocationFilter;
