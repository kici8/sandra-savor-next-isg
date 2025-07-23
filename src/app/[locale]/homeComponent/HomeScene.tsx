"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Card } from "./Card";

type HomeSceneProps = {
  imagesUrl: string[];
};

const HomeScene: React.FC<HomeSceneProps> = ({ imagesUrl }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full touch-none" ref={wrapperRef}>
      <Canvas camera={{ position: [0, 0, 10], fov: 10 }} className="touch-none">
        <ambientLight />
        <ScrollContainer imagesUrl={imagesUrl} containerRef={wrapperRef} />
      </Canvas>
    </div>
  );
};

type ScrollContainerProps = {
  imagesUrl: string[];
  containerRef: React.RefObject<HTMLDivElement>;
};

const ScrollContainer: React.FC<ScrollContainerProps> = ({
  imagesUrl,
  containerRef,
}) => {
  const { height } = useThree((state) => state.viewport);

  const cardHeightInViewportPercentage = 0.56;
  const gap = 0.05;
  const cardHeight = height * cardHeightInViewportPercentage - gap;
  const cardWidth = (cardHeight / 4) * 3;
  const cardHeightWithGap = cardHeight + gap;
  const pages = (imagesUrl.length * cardHeightWithGap) / height + 1;

  return (
    <Suspense fallback={null}>
      {imagesUrl.map((url, index) => {
        return (
          <Card
            key={url}
            url={url}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            cardHeightWithGap={cardHeightWithGap}
            pages={pages}
            totalNumberOfCards={imagesUrl.length}
            index={index}
            containerRef={containerRef}
          />
        );
      })}
    </Suspense>
  );
};

export default HomeScene;
