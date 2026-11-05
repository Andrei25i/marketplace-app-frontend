import type { LocalAdImage } from "@/types/ads.type";
import { Badge, Box, SimpleGrid, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import ImageTile from "@/components/ui/images/ImageTile";
import ImageLightbox from "@/components/ui/images/ImageLightbox";
import useImageLightbox from "@/components/ui/images/useImageLightbox";
import { AnimatePresence, motion } from "motion/react";
import { arrayMove } from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import SortableGrid from "./SortableGrid";
import AddImageTile from "./AddImageTile";

interface ImageSelectorProps {
  images: LocalAdImage[];
  onChange: (images: LocalAdImage[]) => void;
  maxImages?: number;
}

const tileMotion = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
  transition: { type: "spring", stiffness: 500, damping: 35 },
} as const;

const ImageSelector = ({
  images,
  onChange,
  maxImages = 10,
}: ImageSelectorProps) => {
  const lightbox = useImageLightbox();
  const ids = images.map((image) => image.preview);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const availableSlots = maxImages - images.length;
    const selectedFiles = Array.from(files);

    if (selectedFiles.length > availableSlots) {
      notifications.show({
        title: "Prea multe imagini",
        message: `Poți adăuga maximum ${maxImages} imagini. Doar primele ${availableSlots} au fost adăugate.`,
        color: "red",
        icon: <IconAlertCircle size={18} />,
      });
    }

    const next = selectedFiles
      .slice(0, availableSlots)
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));

    onChange([...images, ...next]);
  };

  const handleRemove = (index: number) => {
    URL.revokeObjectURL(images[index].preview);
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <SortableGrid
        ids={ids}
        onReorder={(from, to) => onChange(arrayMove(images, from, to))}
      >
        {(isSorting) => (
          <SimpleGrid
            cols={{ base: 3, sm: 4 }}
            spacing="sm"
            style={{ position: "relative" }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {images.map((image, index) => (
                <motion.div
                  key={image.preview}
                  {...tileMotion}
                  layout={!isSorting}
                >
                  <SortableItem
                    id={image.preview}
                    label={`Imaginea ${index + 1}. Apasă Space și folosește săgețile ca să o muți.`}
                  >
                    <ImageTile
                      src={image.preview}
                      alt={`Imaginea ${index + 1}`}
                      thumbWidth={400}
                      selected={index === 0}
                      onClick={() => lightbox.open(index)}
                      onRemove={() => handleRemove(index)}
                      removeLabel="Șterge imaginea"
                    >
                      {index === 0 && (
                        <Badge
                          pos="absolute"
                          top={6}
                          left={6}
                          size="xs"
                          color="primary"
                          style={{ pointerEvents: "none" }}
                        >
                          Copertă
                        </Badge>
                      )}
                    </ImageTile>
                  </SortableItem>
                </motion.div>
              ))}

              {images.length < maxImages && (
                <motion.div key="add" {...tileMotion} layout>
                  <AddImageTile onFiles={handleFiles} />
                </motion.div>
              )}
            </AnimatePresence>
          </SimpleGrid>
        )}
      </SortableGrid>

      {images.length > 1 && (
        <Text size="xs" c="dimmed" mt="xs">
          Trage imaginile ca să schimbi ordinea. Prima imagine este coperta.
        </Text>
      )}

      <ImageLightbox
        images={images.map((image, index) => ({
          src: image.preview,
          alt: `Imaginea ${index + 1}`,
        }))}
        opened={lightbox.opened}
        initialIndex={lightbox.initialIndex}
        onClose={lightbox.close}
      />
    </Box>
  );
};

export default ImageSelector;
