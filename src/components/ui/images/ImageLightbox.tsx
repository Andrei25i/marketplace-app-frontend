import { ActionIcon, Box, Modal } from "@mantine/core";
import classes from "./ImageLightbox.module.css";
import { useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import useEmblaActiveIndex from "./useEmblaActiveIndex";
import { useHotkeys } from "@mantine/hooks";
import { Carousel } from "@mantine/carousel";
import { cloudinaryUrl } from "@/utils/cloudinary.util";
import { IconX } from "@tabler/icons-react";
import CarouselArrowButton from "./CarouselArrowButton";
import ImageCounter from "./ImageCounter";
import LoadingImage from "./LoadingImage";

export type LightboxImage = {
  src: string;
  alt?: string;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  opened: boolean;
  initialIndex?: number;
  onClose: () => void;
};

const BUTTON_SIZE = 48;

const LightboxViewer = ({
  images,
  initialIndex,
  onClose,
}: Omit<ImageLightboxProps, "opened"> & { initialIndex: number }) => {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const activeIndex = useEmblaActiveIndex(embla);
  const hasMany = images.length > 1;

  useHotkeys([
    ["ArrowLeft", () => embla?.scrollPrev()],
    ["ArrowRight", () => embla?.scrollNext()],
  ]);

  return (
    <Box className={classes.viewer}>
      <Carousel
        height="100dvh"
        withControls={false}
        withIndicators={false}
        getEmblaApi={setEmbla}
        initialSlide={Math.min(initialIndex, images.length - 1)}
      >
        {images.map((image, index) => (
          <Carousel.Slide key={`${image.src}-${index}`}>
            <Box
              className={classes.slide}
              onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
              }}
            >
              <LoadingImage
                src={cloudinaryUrl(image.src, { width: 2000 })}
                alt={image.alt ?? `Imaginea ${index + 1}`}
                className={classes.image}
                loaderColor="primary.6"
                loaderSize="md"
                draggable={false}
              />
            </Box>
          </Carousel.Slide>
        ))}
      </Carousel>

      <ActionIcon
        variant="white"
        color="dark"
        radius="xl"
        size={BUTTON_SIZE}
        className={classes.close}
        onClick={onClose}
        aria-label="Închide"
      >
        <IconX size={24} />
      </ActionIcon>

      {hasMany && (
        <>
          <Box className={`${classes.arrow} ${classes.prev}`}>
            <CarouselArrowButton
              direction="prev"
              size={BUTTON_SIZE}
              onClick={() => embla?.scrollPrev()}
            />
          </Box>

          <Box className={`${classes.arrow} ${classes.next}`}>
            <CarouselArrowButton
              direction="next"
              size={BUTTON_SIZE}
              onClick={() => embla?.scrollNext()}
            />
          </Box>

          <ImageCounter activeIndex={activeIndex} totalImages={images.length} />
        </>
      )}
    </Box>
  );
};

const ImageLightbox = ({
  images,
  opened,
  initialIndex = 0,
  onClose,
}: ImageLightboxProps) => {
  return (
    <Modal
      opened={opened && images.length > 0}
      onClose={onClose}
      fullScreen
      withCloseButton={false}
      padding={0}
      radius={0}
      transitionProps={{ transition: "fade", duration: 150 }}
      classNames={{ content: classes.content, body: classes.body }}
      aria-label="Vizualizare imagini"
    >
      <LightboxViewer
        images={images}
        initialIndex={initialIndex}
        onClose={onClose}
      />
    </Modal>
  );
};

export default ImageLightbox;
