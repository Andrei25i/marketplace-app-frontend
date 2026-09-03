import type { AdImage } from "@/types/ads.type";
import { Box, Group, ScrollArea } from "@mantine/core";
import { useEffect, useRef } from "react";

type AdImageThumbnailsProps = {
  title: string;
  images: AdImage[];
  activeIndex: number;
  onThumbnailClick: (index: number) => void;
};

const AdImageThumbnails = ({
  title,
  images,
  activeIndex,
  onThumbnailClick,
}: AdImageThumbnailsProps) => {
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbnailStripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = thumbnailStripRef.current;
    const thumbnail = thumbnailRefs.current[activeIndex];

    if (!container || !thumbnail) return;

    const targetScrollLeft =
      thumbnail.offsetLeft -
      container.clientWidth / 2 +
      thumbnail.clientWidth / 2;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <ScrollArea
      type="scroll"
      scrollbarSize={10}
      offsetScrollbars="present"
      viewportRef={thumbnailStripRef}
      mt="md"
      pb="md"
      styles={{
        root: {
          width: "100%",
        },
        viewport: {
          paddingBottom: 4,
        },
      }}
    >
      <Group gap={12} wrap="nowrap">
        {images.map((image, index) => (
          <Box
            key={image.url ?? index}
            ref={(element: HTMLDivElement | null) => {
              thumbnailRefs.current[index] = element;
            }}
            onClick={() => onThumbnailClick(index)}
            style={{
              flexShrink: 0,
              width: 75,
              aspectRatio: "1/1",
              borderRadius: 12,
              overflow: "hidden",
              cursor: "pointer",
              border:
                index === activeIndex
                  ? "2px solid var(--mantine-color-primary-6)"
                  : "2px solid var(--mantine-color-gray-2)",
              opacity: index === activeIndex ? 1 : 0.6,
            }}
          >
            <img
              src={image.url}
              alt={`${title} ${index + 1}`}
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Group>
    </ScrollArea>
  );
};

export default AdImageThumbnails;
