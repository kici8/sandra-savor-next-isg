"use client";

import {
  HTMLMotionProps,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

type TypeParallaxSurfaceProperties = HTMLMotionProps<"div"> & {
  startPosition?: number;
  endPosition?: number;
};

const ParallaxSurface: React.FC<TypeParallaxSurfaceProperties> = ({
  children,
  startPosition = -100,
  endPosition = 0,
  ...props
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [_window, setWindow] = useState<Window | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindow(window);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    // ["Element Window", "Element Window"]
    offset: ["start end", "end start"],
  });

  const test = useTransform(
    scrollYProgress,
    [0, 1],
    [startPosition, endPosition],
  );

  return (
    <motion.div
      style={{
        translateY: test,
        opacity: _window ? 1 : 0,
      }}
      ref={wrapperRef}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSurface;
