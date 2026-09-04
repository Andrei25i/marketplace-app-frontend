import type { GetAdsFilters } from "@/types/ads.type";
import {
  ActionIcon,
  Button,
  Divider,
  Drawer,
  Group,
  ScrollArea,
  Title,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import FiltersPanel from "./FiltersPanel";
import { DEFAULT_AD_FILTERS } from "@/utils/searchFilters.util";

interface FiltersDrawerProps {
  opened: boolean;
  onClose: () => void;
  filters: GetAdsFilters;
  onApply: (filters: GetAdsFilters) => void;
}

export const FiltersDrawer = ({
  opened,
  onClose,
  filters,
  onApply,
}: FiltersDrawerProps) => {
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    if (opened) {
      setTempFilters(filters);
    }
  }, [opened, filters]);

  const handleResetFilters = () => {
    const resetFilters = { ...DEFAULT_AD_FILTERS, search: tempFilters.search };
    setTempFilters(resetFilters);
  };

  const handleApplyFilters = () => {
    onApply(tempFilters);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      closeOnEscape={true}
      trapFocus={false}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
        content: {
          borderRadius: "16px 16px 0 0",
          height: "90%",
          maxHeight: "90vh",
        },
      }}
    >
      <Group
        justify="space-between"
        px="xs"
        py="xs"
        wrap="nowrap"
        style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
      >
        <Title order={2} size="h4">
          Filtrează
        </Title>

        <ActionIcon
          variant="subtle"
          color="primary.6"
          c="dark"
          radius="md"
          onClick={onClose}
        >
          <IconX size={20} />
        </ActionIcon>
      </Group>

      <ScrollArea type="auto" style={{ flex: 1 }}>
        <FiltersPanel
          value={tempFilters}
          onChange={setTempFilters}
          variant="drawer"
        />
      </ScrollArea>

      <Divider />

      <Group
        gap="md"
        p="md"
        style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
      >
        <Button fullWidth onClick={handleApplyFilters} size="md">
          Aplică Filtre
        </Button>

        <Button
          variant="light"
          fullWidth
          onClick={handleResetFilters}
          size="md"
        >
          Resetează
        </Button>
      </Group>
    </Drawer>
  );
};
