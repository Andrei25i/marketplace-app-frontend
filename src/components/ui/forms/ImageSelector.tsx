import type { LocalAdImage } from "@/types/ads.type";
import {
  ActionIcon,
  Badge,
  Box,
  Center,
  SimpleGrid,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconPhotoPlus,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { useRef } from "react";
import ImageTile from "@/components/ui/images/ImageTile";
import ImageLightbox from "@/components/ui/images/ImageLightbox";
import useImageLightbox from "@/components/ui/images/useImageLightbox";

interface ImageSelectorProps {
  images: LocalAdImage[];
  onChange: (images: LocalAdImage[]) => void;
  maxImages?: number;
}

const ImageSelector = ({
  images,
  onChange,
  maxImages = 10,
}: ImageSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const lightbox = useImageLightbox();

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

  const handleSetThumbnail = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    onChange(next);
  };

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.currentTarget.files);
          e.currentTarget.value = "";
        }}
      />

      <SimpleGrid cols={{ base: 3, sm: 4 }} spacing="sm">
        {images.map((image, index) => {
          const isCover = index === 0;

          return (
            <ImageTile
              key={image.preview}
              src={image.preview}
              alt={`Imaginea ${index + 1}`}
              thumbWidth={400}
              selected={isCover}
              onClick={() => lightbox.open(index)}
              onRemove={() => handleRemove(index)}
              removeLabel="Șterge imaginea"
            >
              {isCover && (
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

              <Tooltip
                label={isCover ? "Imagine principală" : "Setează ca copertă"}
                openDelay={400}
              >
                <ActionIcon
                  size="sm"
                  variant="filled"
                  color={isCover ? "yellow" : "dark"}
                  radius="xl"
                  pos="absolute"
                  bottom={6}
                  left={6}
                  onClick={() => handleSetThumbnail(index)}
                  aria-label="Setează ca imagine principală"
                >
                  {isCover ? (
                    <IconStarFilled size={14} />
                  ) : (
                    <IconStar size={14} />
                  )}
                </ActionIcon>
              </Tooltip>
            </ImageTile>
          );
        })}

        {images.length < maxImages && (
          <UnstyledButton
            onClick={() => inputRef.current?.click()}
            style={{
              aspectRatio: "1/1",
              borderRadius: "var(--mantine-radius-md)",
              border: "1px dashed var(--mantine-color-gray-4)",
            }}
          >
            <Center h="100%">
              <Box ta="center" c="dimmed">
                <IconPhotoPlus
                  size={20}
                  color="var(--mantine-color-primary-6)"
                />
                <Text size="xs">Adaugă</Text>
              </Box>
            </Center>
          </UnstyledButton>
        )}
      </SimpleGrid>

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
