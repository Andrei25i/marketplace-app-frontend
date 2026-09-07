import type { LocalAdImage } from "@/types/ads.type";
import {
  ActionIcon,
  Badge,
  Box,
  Center,
  SimpleGrid,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconPhotoPlus,
  IconStar,
  IconStarFilled,
  IconX,
} from "@tabler/icons-react";
import { useRef } from "react";

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
        {images.map((image, index) => (
          <Box
            key={image.preview}
            pos="relative"
            style={{
              aspectRatio: "1/1",
              borderRadius: "var(--mantine-radius-md)",
              overflow: "hidden",
              border:
                index === 0
                  ? "3px solid var(--mantine-color-primary-6)"
                  : "3px solid var(--mantine-color-gray-3)",
            }}
          >
            <img
              src={image.preview}
              alt={`Imagine ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <ActionIcon
              size="sm"
              variant="filled"
              color="dark"
              radius="xl"
              pos="absolute"
              top={4}
              right={4}
              onClick={() => handleRemove(index)}
              aria-label="Șterge imaginea"
            >
              <IconX size={14} />
            </ActionIcon>

            <ActionIcon
              size="sm"
              variant="filled"
              color={index === 0 ? "yellow" : "dark"}
              radius="xl"
              pos="absolute"
              bottom={4}
              left={4}
              onClick={() => handleSetThumbnail(index)}
              aria-label="Setează ca imagine principală"
            >
              {index === 0 ? (
                <IconStarFilled size={14} />
              ) : (
                <IconStar size={14} />
              )}
            </ActionIcon>

            {index === 0 && (
              <Badge pos="absolute" top={4} left={4} size="xs" color="primary">
                Copertă
              </Badge>
            )}
          </Box>
        ))}

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
    </Box>
  );
};

export default ImageSelector;
