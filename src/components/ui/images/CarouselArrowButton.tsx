import { ActionIcon } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { TablerIcon } from "@tabler/icons-react";
import classes from "./CarouselArrowButton.module.css";

type CarouselArrowButtonProps = {
  direction: "prev" | "next";
  size?: number;
  onClick: () => void;
  ariaLabel?: string;
};

const icons: Record<CarouselArrowButtonProps["direction"], TablerIcon> = {
  prev: IconChevronLeft,
  next: IconChevronRight,
};

const CarouselArrowButton = ({
  direction,
  size = 32,
  onClick,
  ariaLabel,
}: CarouselArrowButtonProps) => {
  const Icon = icons[direction];

  return (
    <ActionIcon
      className={classes.button}
      variant="white"
      color="primary"
      c="dark"
      radius="xl"
      size={size}
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
