import { memo, useMemo, useState } from "react";
import { Select, Flex } from "@mantine/core";
import { IconMap, IconBuildingCommunity } from "@tabler/icons-react";
import locationsData from "@/data/romanian_locations.json";
import { useMediaQuery } from "@mantine/hooks";

const locations = locationsData as Record<string, string[]>;
const roCollator = new Intl.Collator("ro");
const countiesList = Object.keys(locations).sort(roCollator.compare);

const useLazyOptions = (options: string[], selected: string) => {
  const [opened, setOpened] = useState(false);

  return {
    data: opened ? options : selected ? [selected] : [],
    onDropdownOpen: () => setOpened(true),
    onDropdownClose: () => setOpened(false),
  };
};

interface LocationSelectorProps {
  selectedCounty: string;
  selectedCity: string;
  onCountyChange: (county: string) => void;
  onCityChange: (city: string) => void;
  register?: boolean;
  countyError?: string | undefined;
  cityError?: string | undefined;
}

const LocationSelector = ({
  selectedCounty,
  selectedCity,
  onCountyChange,
  onCityChange,
  register = true,
  countyError,
  cityError,
}: LocationSelectorProps) => {
  const availableCities = useMemo(() => {
    if (!selectedCounty) return [];

    return Array.from(new Set(locations[selectedCounty] ?? [])).sort(
      roCollator.compare,
    );
  }, [selectedCounty]);

  const countyOptions = useLazyOptions(countiesList, selectedCounty);
  const cityOptions = useLazyOptions(availableCities, selectedCity);

  const handleCountySelect = (newCounty: string | null) => {
    onCountyChange(newCounty || "");
    onCityChange("");
  };

  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <Flex gap="md" wrap="wrap">
      <Select
        label="Județ"
        placeholder="Selectează județul"
        {...countyOptions}
        value={selectedCounty || null}
        onChange={handleCountySelect}
        searchable={!isMobile}
        clearable
        withAsterisk={register}
        error={countyError}
        leftSection={<IconMap size={18} />}
        style={{ flex: "1 1 140px" }}
      />

      <Select
        label="Localitate"
        placeholder={
          selectedCounty ? "Selectează localitatea" : "Selectează întâi județul"
        }
        {...cityOptions}
        value={selectedCity || null}
        onChange={(val) => onCityChange(val || "")}
        searchable={!isMobile}
        clearable
        disabled={!selectedCounty}
        withAsterisk={register}
        error={cityError}
        leftSection={<IconBuildingCommunity size={18} />}
        style={{ flex: "1 1 140px" }}
      />
    </Flex>
  );
};

export default memo(LocationSelector);
