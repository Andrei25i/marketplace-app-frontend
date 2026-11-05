import { stagger, type Transition, type Variants } from "motion/react";

export const DURATION = {
  fast: 0.15,
  base: 0.2,
  slow: 0.3,
} as const;

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const OFFSET_Y = 8;

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 35,
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: OFFSET_Y },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: DURATION.fast, ease: "easeIn" },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.fast } },
};

export const staggerContainer = (interval = 0.04): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: stagger(interval) } },
});

export const popIn = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
  transition: springSnappy,
} as const;
