"use client";

import { cn } from "@/utils/cn";

type PageTransitionContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  hasDefaultGrid?: boolean;
};

export default function PageTransitionContainer({
  children,
  className,
  ...props
}: PageTransitionContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-container2560 grid-cols-4 gap-4 px-4 lg:grid-cols-12",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
