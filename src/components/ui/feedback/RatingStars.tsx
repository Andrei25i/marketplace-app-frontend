import { Group, Text } from "@mantine/core";
import { IconStar, IconStarHalf } from "@tabler/icons-react";

type RatingStarsProps = {
  score: number;
  reviewCount: number;
};

const RatingStars = ({ score, reviewCount }: RatingStarsProps) => {
  const normalizedScore = Math.min(5, Math.max(0, Math.round(score * 2) / 2));
  const fullStars = Math.floor(normalizedScore);
  const hasHalfStar = normalizedScore % 1 === 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Group
      gap={2}
      wrap="nowrap"
      c="primary.6"
      aria-label={`Scor ${score} din 5, ${reviewCount} recenzii`}
    >
      {Array.from({ length: fullStars }, (_, index) => (
        <IconStar key={`full-${index}`} size={12} fill="currentColor" />
      ))}

      {hasHalfStar && (
        <IconStarHalf size={12} fill="currentColor" aria-hidden />
      )}

      {Array.from({ length: emptyStars }, (_, index) => (
        <IconStar
          key={`empty-${index}`}
          size={14}
          color="var(--mantine-color-gray-5)"
        />
      ))}

      <Text size="xs" c="dimmed" ml={3}>
        ({reviewCount} recenzii)
      </Text>
    </Group>
  );
};

export default RatingStars;
