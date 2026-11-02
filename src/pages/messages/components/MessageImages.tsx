import useImageLightbox from "@/components/ui/images/useImageLightbox";
import type { MessageAttachment } from "@/types/chat.type";
import { Box } from "@mantine/core";
import classes from "../Messages.module.css";
import ImageTile from "@/components/ui/images/ImageTile";
import ImageLightbox from "@/components/ui/images/ImageLightbox";

type MessageImagesProps = {
  attachments: MessageAttachment[];
  sending?: boolean;
};

const getAspectRatio = ({ width, height }: MessageAttachment) => {
  if (!width || !height) return 4 / 3;
  return Math.min(Math.max(width / height, 0.75), 1.6);
};

const MessageImages = ({
  attachments,
  sending = false,
}: MessageImagesProps) => {
  const lightbox = useImageLightbox();
  const images = attachments.filter(
    (attachment) => attachment.kind === "image",
  );

  if (images.length === 0) return null;

  const [first] = images;
  const extra = images.length - 1;

  return (
    <>
      <Box className={classes.messageImage}>
        <ImageTile
          src={first.url}
          alt={
            images.length > 1
              ? `Deschide cele ${images.length} imagini`
              : "Deschide imaginea"
          }
          aspectRatio={getAspectRatio(first)}
          loading={sending}
          onClick={sending ? undefined : () => lightbox.open(0)}
        >
          {extra > 0 && <Box className={classes.moreImages}>+{extra}</Box>}
        </ImageTile>
      </Box>

      <ImageLightbox
        images={images.map((image, index) => ({
          src: image.url,
          alt: `Imaginea ${index + 1} din ${images.length}`,
        }))}
        opened={lightbox.opened}
        initialIndex={lightbox.initialIndex}
        onClose={lightbox.close}
      />
    </>
  );
};

export default MessageImages;
