import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT } from "@/theme/motion";

type RevealProps = {
  show: boolean;
  children: ReactNode;
};

const Reveal = ({ show, children }: RevealProps) => (
  <AnimatePresence initial={false}>
    {show && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: DURATION.base, ease: EASE_OUT }}
        style={{ overflow: "hidden" }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default Reveal;
