import { Card, Text, ThemeIcon } from "@mantine/core";
import { Link } from "react-router-dom";
import type { ElementType } from "react";
import type { CategoryDTO } from "@/types/category.type";
import classes from "./CategoriesCard.module.css";

interface CategoryCardProps {
  category: CategoryDTO;
  icon: ElementType;
  compact?: boolean;
}

const CategoryCard = ({
  category,
  icon,
  compact = false,
}: CategoryCardProps) => {
  const Icon = icon;

  return (
    <Card
      component={Link}
      to={`/search?category=${category.id}`}
      withBorder
      radius="lg"
      bg="white"
      className={classes.card}
      padding={compact ? "sm" : "lg"}
    >
      <ThemeIcon
        variant={compact ? "transparent" : "light"}
        size={compact ? 32 : 60}
        mb={compact ? "xs" : "md"}
      >
        <Icon size={compact ? 32 : 30} />
      </ThemeIcon>

      <Text
        fw={600}
        size={compact ? "sm" : "md"}
        c="dark.8"
        className={classes.cardLabel}
      >
        {category.name}
      </Text>
    </Card>
  );
};

export default CategoryCard;
