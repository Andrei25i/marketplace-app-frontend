import { ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";

type CarouselArrowButtonProps = {
  direction: "prev" | "next";
  onClick: () => void;
  ariaLabel?: string;
};

const icons: Record<CarouselArrowButtonProps["direction"], TablerIcon> = {
  prev: IconChevronLeft,
  next: IconChevronRight,
};

const CarouselArrowButton = ({
  direction,
  onClick,
  ariaLabel,
}: CarouselArrowButtonProps) => {
  const Icon = icons[direction];

  return (
    <ActionIcon
      variant="white"
      color="primary"
      c="dark"
      radius="xl"
      size={32}
      onClick={onClick}
      aria-label={
        ariaLabel ??
        (direction === "prev" ? "Imaginea anterioară" : "Imaginea următoare")
      }
    >
      <Icon size={18} />
    </ActionIcon>
  );
};

export default CarouselArrowButton;
