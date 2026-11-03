import { Badge, CloseButton, Group } from "@mantine/core";

type AdBadgeProps = {
  title: string;
  onRemove: () => void;
};

const AdBadge = ({ title, onRemove }: AdBadgeProps) => {
  return (
    <Group mb="xs">
      <Badge
        variant="light"
        color="primary"
        tt="none"
        maw="100%"
        rightSection={
          <CloseButton
            size="xs"
            onClick={onRemove}
            aria-label="Elimină anunțul"
          />
        }
      >
        Despre: {title}
      </Badge>
    </Group>
  );
};

export default AdBadge;
