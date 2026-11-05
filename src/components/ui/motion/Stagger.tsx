import { motion, type HTMLMotionProps } from "motion/react";
import { fadeInUp, staggerContainer } from "@/theme/motion";

type StaggerProps = HTMLMotionProps<"div"> & {
  interval?: number;
};

export const Stagger = ({ interval = 0.03, ...rest }: StaggerProps) => (
  <motion.div
    variants={staggerContainer(interval)}
    initial="hidden"
    animate="visible"
    {...rest}
  />
);

export const StaggerItem = ({ style, ...rest }: HTMLMotionProps<"div">) => (
  <motion.div
    variants={fadeInUp}
    exit="exit"
    style={{ height: "100%", ...style }}
    {...rest}
  />
);
