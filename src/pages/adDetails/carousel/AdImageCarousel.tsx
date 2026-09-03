import { useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { Carousel } from "@mantine/carousel";
import { Box } from "@mantine/core";
import type { AdImage } from "@/types/ads.type";
import CarouselArrowButton from "@/pages/adDetails/carousel/CarouselArrowButton";
import AdImageThumbnails from "@/pages/adDetails/carousel/AdImageThumbnails";
import useEmblaActiveIndex from "@/pages/adDetails/carousel/useEmblaActiveIndex";
import ImageCounter from "@/pages/adDetails/carousel/ImageCounter";

type AdImageCarouselProps = {
  title: string;
  images: AdImage[];
};

const AdImageCarousel = ({ title, images }: AdImageCarouselProps) => {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const activeIndex = useEmblaActiveIndex(embla);

  return (
    <div style={{ width: "100%", maxWidth: 650 }}>
      <Box
        pos="relative"
        style={{
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid var(--mantine-color-gray-2)",
          backgroundColor: "var(--mantine-color-gray-2)",
        }}
      >
        <Carousel
          height="clamp(250px, 45vw, 400px)"
          withControls={false}
          withIndicators={false}
          getEmblaApi={setEmbla}
          initialSlide={0}
        >
          {images.map((image, index) => (
            <Carousel.Slide
              key={image.url ?? index}
              style={{
                height: "100%",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={image.url}
                alt={`${title}_${index + 1}`}
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>

        <Box
          pos="absolute"
          left={16}
          top="50%"
          style={{ transform: "translateY(-50%)" }}
        >
          <CarouselArrowButton
            direction="prev"
            onClick={() => embla?.scrollPrev()}
          />
        </Box>

        <Box
          pos="absolute"
          right={16}
          top="50%"
          style={{ transform: "translateY(-50%)" }}
        >
          <CarouselArrowButton
            direction="next"
            onClick={() => embla?.scrollNext()}
          />
        </Box>

        <ImageCounter activeIndex={activeIndex} totalImages={images.length} />
      </Box>

      <AdImageThumbnails
        title={title}
        images={images}
        activeIndex={activeIndex}
        onThumbnailClick={(index) => embla?.scrollTo(index)}
      />
    </div>
  );
};

export default AdImageCarousel;
