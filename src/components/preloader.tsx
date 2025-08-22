"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type PreloaderProps = {};

const Preloader: React.FC<PreloaderProps> = ({}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      wrapperRef.current,
      { background: "#ff00ff" },
      {
        background: "transparent",
        duration: 1.5,
        ease: "power2.out",
        delay: 0,
      },
    );
  }, {});

  return (
    <div
      className="pointer-events-none h-full w-full touch-none"
      ref={wrapperRef}
    ></div>
  );
};

export default Preloader;
