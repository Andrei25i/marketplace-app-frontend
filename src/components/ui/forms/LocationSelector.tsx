import { memo, useEffect, useState } from "react";
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
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    if (selectedCounty) {
      const rawCities =
        (locationsData as Record<string, string[]>)[selectedCounty] || [];

      const uniqueCities = Array.from(new Set(rawCities));

      uniqueCities.sort((a, b) => a.localeCompare(b, "ro"));

      setAvailableCities(uniqueCities);
    } else {
      setAvailableCities([]);
    }
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
