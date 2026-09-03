import { useCallback, useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";

const useEmblaActiveIndex = (embla: EmblaCarouselType | null): number => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = useCallback(() => {
    if (embla) {
      setActiveIndex(embla.selectedScrollSnap());
    }
  }, [embla]);

  useEffect(() => {
    if (!embla) return;

    embla.on("select", handleSelect);
    handleSelect();

    return () => {
      embla.off("select", handleSelect);
    };
  }, [embla, handleSelect]);

  return activeIndex;
};

export default useEmblaActiveIndex;
