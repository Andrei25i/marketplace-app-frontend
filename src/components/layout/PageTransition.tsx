import { motion } from "motion/react";
import { useMatches } from "react-router-dom";
import type { ReactNode } from "react";
import { fadeInUp } from "@/theme/motion";

type PageTransitionProps = {
  children: ReactNode;
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const routeId = useMatches().at(-1)?.id;

  return (
    <motion.div
      key={routeId}
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
