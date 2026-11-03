import useImageLightbox from "@/components/ui/images/useImageLightbox";
import type { PendingImage } from "./useComposerImages";
import { Box, Button, Group, ScrollArea } from "@mantine/core";
import { Text } from "@mantine/core";
import { MAX_ATTACHMENTS } from "@/utils/chat.util";
import { IconTrash } from "@tabler/icons-react";
import ImageTile from "@/components/ui/images/ImageTile";
import classes from "@/pages/messages/Messages.module.css";
import ImageLightbox from "@/components/ui/images/ImageLightbox";

type ComposerImageStripProps = {
  images: PendingImage[];
  onRemove: (index: number) => void;
  onClear: () => void;
};

const ComposerImageStrip = ({
  images,
  onRemove,
  onClear,
}: ComposerImageStripProps) => {
  const lightbox = useImageLightbox();
  const alt = (index: number) => `Imaginea selectată ${index + 1}`;

  return (
    <Box mb="xs">
      <Group justify="space-between" mb={6}>
        <Text size="xs" c="dimmed">
          {images.length}/{MAX_ATTACHMENTS} imagini
        </Text>
        <Button
          size="compact-xs"
          variant="subtle"
          color="red"
          onClick={onClear}
        >
          <IconTrash size={14} />
        </Button>
      </Group>

      <ScrollArea type="auto" scrollbarSize={6} offsetScrollbars>
        <Group gap="xs" wrap="nowrap" className={classes.composerImages}>
          {images.map((image, index) => (
            <ImageTile
              key={image.preview}
              src={image.preview}
              alt={alt(index)}
              width={64}
              onClick={() => lightbox.open(index)}
              onRemove={() => onRemove(index)}
            />
          ))}
        </Group>
      </ScrollArea>

      <ImageLightbox
        images={images.map((image, index) => ({
          src: image.preview,
          alt: `Imaginea selectată ${index + 1}`,
        }))}
        opened={lightbox.opened}
        initialIndex={lightbox.initialIndex}
        onClose={lightbox.close}
      />
    </Box>
  );
};

export default ComposerImageStrip;
