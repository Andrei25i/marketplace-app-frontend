import { Card, Skeleton, Text } from "@mantine/core";
import classes from "./CategoriesCard.module.css";

type CategoryCardSkeletonProps = {
  compact?: boolean;
};

const CategoryCardSkeleton = ({
  compact = false,
}: CategoryCardSkeletonProps) => {
  return (
    <Card
      withBorder
      radius="lg"
      bg="white"
      className={classes.card}
      padding={compact ? "sm" : "lg"}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      {compact ? (
        <Skeleton circle height={32} mb="xs" />
      ) : (
        <Skeleton circle height={60} width={60} mb="md" />
      )}

      <Skeleton width="60%" radius="sm">
        <Text fw={600} size={compact ? "sm" : "md"}>
          &nbsp;
        </Text>
      </Skeleton>
    </Card>
  );
};

export default CategoryCardSkeleton;
