"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

type AnimatedCopyProps = {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
};

gsap.registerPlugin(SplitText, ScrollTrigger);

export const AnimatedCopy = ({
  children,
  animateOnScroll = true,
  delay = 0,
}: AnimatedCopyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement[]>([]);
  const splitRef = useRef<SplitText[]>([]);
  const linesRef = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRef.current = [];
      elementRef.current = [];
      linesRef.current = [];

      let elements: HTMLElement[] = [];

      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children).filter(
          // Only get HTMLElements
          (el): el is HTMLElement => el instanceof HTMLElement,
        );
      } else {
        elements = [containerRef.current];
      }
      elements.forEach((element) => {
        elementRef.current.push(element);

        const split = SplitText.create(element, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
        });

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.textIndent;
        if (textIndent && textIndent !== "0px") {
          if (split.lines && split.lines.length > 0) {
            const firstLine = split.lines[0];
            if (firstLine instanceof HTMLElement) {
              firstLine.style.paddingLeft = textIndent;
            }
          }
          element.style.textIndent = "0px";
        }

        splitRef.current.push(split);

        // Only push HTMLElements to linesRef.current
        linesRef.current.push(
          ...split.lines.filter(
            (line): line is HTMLElement => line instanceof HTMLElement,
          ),
        );
      });

      gsap.set(linesRef.current, { y: "100%" });

      const animationProps = {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(linesRef.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
            // markers: true,
          },
        });
      } else {
        gsap.to(linesRef.current, animationProps);
      }

      return () => {
        splitRef.current.forEach((split) => {
          if (split) split.revert();
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    },
  );

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
};
