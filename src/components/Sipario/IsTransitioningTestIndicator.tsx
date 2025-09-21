"use client";

import { usePageTransition } from "./TransitionContext";

export const IsTransitioningTestIndicator = () => {
  const { isTransitioning } = usePageTransition();
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        padding: "5px 10px",
        backgroundColor: isTransitioning ? "red" : "green",
        color: "white",
        zIndex: 1000,
      }}
    >
      {isTransitioning ? "Transitioning" : "Idle"}
    </div>
  );
};
