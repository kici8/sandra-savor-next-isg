"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText);

type AnimatedCopyProps = {
  show: boolean;
  children: ReactNode;
};

export function AnimatedCopy({ show, children }: AnimatedCopyProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const splitRef = useRef<SplitText | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    // inizializza SplitText
    splitRef.current = new SplitText(containerRef.current, { type: "lines" });

    // stato iniziale: nascosto
    gsap.set(splitRef.current.lines, { y: 50, opacity: 0 });
  }, []);

  useEffect(() => {
    if (!splitRef.current) return;
    const lines = splitRef.current.lines;

    if (show) {
      // animazione di entrata
      gsap.to(lines, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
      });
    } else {
      // animazione di uscita
      gsap.to(lines, {
        y: -50,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        stagger: 0.05,
      });
    }
  }, [show]);

  return (
    <div
      ref={containerRef}
      style={{ overflow: "hidden", display: "inline-block" }}
    >
      {children}
    </div>
  );
}
