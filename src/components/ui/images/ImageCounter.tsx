import { Group, Text } from "@mantine/core";
import { IconCamera } from "@tabler/icons-react";

type ImageCounterProps = {
  activeIndex: number;
  totalImages: number;
};

const ImageCounter = ({ activeIndex, totalImages }: ImageCounterProps) => {
  return (
    <Group
      gap={6}
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        padding: "4px 12px",
        borderRadius: 999,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
      }}
    >
      <IconCamera size={14} />

      <Text size="xs" fw={500}>
        {activeIndex + 1}/{totalImages}
      </Text>
    </Group>
  );
};

export default ImageCounter;
