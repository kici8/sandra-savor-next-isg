"use client";

import { cn } from "@/utils/cn";
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type LogoProps = React.SVGProps<SVGSVGElement>;

const Logo = (props: LogoProps) => {
  const [isHover, setIsHover] = useState(false);
  const { className, ...rest } = props;

  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const targetLength = isHover ? 0.88 : 1;
      [path1Ref.current, path2Ref.current].forEach((path) => {
        if (path) {
          const totalLength = path.getTotalLength();
          gsap.to(path, {
            strokeDasharray: `${totalLength * targetLength},${totalLength}`,
            duration: 0.4,
            ease: "power2.out",
          });
        }
      });
    },
    { dependencies: [isHover] },
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="1.5"
      clipRule="evenodd"
      viewBox="0 0 24 24"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={cn("h-8 w-8", className)}
      {...rest}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path
        ref={path1Ref}
        fill="none"
        stroke="currentColor"
        d="M12 12.811C14.932 10.38 17.098 7.612 17 5c-.096-2.573-1.499-2.969-2.245-2.785-.746.183-1.447.951-1.431 2.785.016 1.804.63 5.198 1.409 7.5.772 2.286 1.74 3.598 2.077 5.76.27 1.732-.665 2.961-1.81 2.879-1.307-.093-1.888-1.44-2-2.814-.105-1.292.222-4.225 5.62-7.034"
      />
      <path
        ref={path2Ref}
        fill="none"
        stroke="currentColor"
        d="M12 12.811c-2.808 2.33-5.43 3.494-5.5 5.992-.06 2.138 1.179 3.004 2.26 2.979 1.281-.031 2.216-1.277 2.04-3.282-.166-1.899-1.072-3.997-1.522-5-.474-1.056-2.328-3.967-2.581-7C6.474 3.833 7.897 2.702 9 2.743c1.106.04 2.515 1.261 2.266 4.257-.328 3.942-3.668 6.132-5.906 6.223"
      />
    </svg>
  );
};

export default Logo;
