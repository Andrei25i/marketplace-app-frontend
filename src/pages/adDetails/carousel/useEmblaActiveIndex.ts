import { useCallback, useSyncExternalStore } from "react";
import type { EmblaCarouselType } from "embla-carousel";

const useEmblaActiveIndex = (embla: EmblaCarouselType | null): number => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!embla) return () => {};

      embla.on("select", onChange);
      return () => {
        embla.off("select", onChange);
      };
    },
    [embla],
  );

  return useSyncExternalStore(
    subscribe,
    () => embla?.selectedScrollSnap() ?? 0,
  );
};

export default useEmblaActiveIndex;
