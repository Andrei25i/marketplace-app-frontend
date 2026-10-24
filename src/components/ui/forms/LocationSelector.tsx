import { memo, useMemo } from "react";
import { Select, Flex } from "@mantine/core";
import { IconMap, IconBuildingCommunity } from "@tabler/icons-react";
import locationsData from "@/data/romanian_locations.json";
import { useMediaQuery } from "@mantine/hooks";

const countiesList = Object.keys(locationsData).sort();

interface LocationSelectorProps {
  selectedCounty: string;
  selectedCity: string;
  onCountyChange: (county: string) => void;
  onCityChange: (city: string) => void;
  register?: boolean;
}

const LocationSelector = ({
  selectedCounty,
  selectedCity,
  onCountyChange,
  onCityChange,
  register = true,
}: LocationSelectorProps) => {
  const availableCities = useMemo(() => {
    if (!selectedCounty) return [];

    const rawCities =
      (locationsData as Record<string, string[]>)[selectedCounty] || [];

    return Array.from(new Set(rawCities)).sort((a, b) =>
      a.localeCompare(b, "ro"),
    );
  }, [selectedCounty]);

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
        data={countiesList}
        value={selectedCounty || null}
        onChange={handleCountySelect}
        searchable={!isMobile}
        clearable
        withAsterisk={register}
        leftSection={<IconMap size={18} />}
        style={{ flex: "1 1 140px" }}
      />

      <Select
        label="Localitate"
        placeholder={
          selectedCounty ? "Selectează localitatea" : "Selectează întâi județul"
        }
        data={availableCities}
        value={selectedCity || null}
        onChange={(val) => onCityChange(val || "")}
        searchable={!isMobile}
        clearable
        disabled={!selectedCounty}
        withAsterisk={register}
        leftSection={<IconBuildingCommunity size={18} />}
        style={{ flex: "1 1 140px" }}
      />
    </Flex>
  );
};

export default memo(LocationSelector);
