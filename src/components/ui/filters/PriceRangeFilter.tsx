import { Group, RangeSlider, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";

export const PRICE_SLIDER_MAX = 5000;

type PriceRangeFilterProps = {
  minPrice?: string;
  maxPrice?: string;
  onChange?: (next: { minPrice?: string; maxPrice?: string }) => void;
};

const PriceRangeFilter = ({
  minPrice = "0",
  maxPrice,
  onChange,
}: PriceRangeFilterProps) => {
  const [localRange, setLocalRange] = useState<[number, number]>([
    Number(minPrice ?? 0),
    Number(maxPrice ?? PRICE_SLIDER_MAX),
  ]);

  useEffect(() => {
    setLocalRange([
      Number(minPrice ?? 0),
      Number(maxPrice ?? PRICE_SLIDER_MAX),
    ]);
  }, [minPrice, maxPrice]);

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text fw={700} size="xs" c="dimmed" tt="uppercase">
          Interval preț
        </Text>

        <Text size="xs" fw={600} c="primary">
          {Number(minPrice ?? 0)} -{" "}
          {maxPrice === undefined ? `${PRICE_SLIDER_MAX}+` : maxPrice}
        </Text>
      </Group>

      <RangeSlider
        min={0}
        max={PRICE_SLIDER_MAX}
        step={50}
        value={localRange}
        onChange={setLocalRange}
        onChangeEnd={([nextMin, nextMax]) => {
          onChange?.({
            minPrice: nextMin <= 0 ? "0" : String(nextMin),
            maxPrice: nextMax >= PRICE_SLIDER_MAX ? undefined : String(nextMax),
          });
        }}
        label={(value) =>
          value >= PRICE_SLIDER_MAX ? `${PRICE_SLIDER_MAX}+` : `${value}`
        }
      />
    </Stack>
  );
};

export default PriceRangeFilter;
