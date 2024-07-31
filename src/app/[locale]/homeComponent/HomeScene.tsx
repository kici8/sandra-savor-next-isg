"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { Card } from "./Card";

type HomeSceneProps = {
  imagesUrl: string[];
};

const HomeScene: React.FC<HomeSceneProps> = ({ imagesUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 10 }}>
      <ambientLight />
      <ScrollContainer imagesUrl={imagesUrl} />
    </Canvas>
  );
};

type ScrollContainerProps = {
  imagesUrl: string[];
};

const ScrollContainer: React.FC<ScrollContainerProps> = ({ imagesUrl }) => {
  const { height } = useThree((state) => state.viewport);

  const cardHeightInViewportPercentage = 0.64;
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
          />
        );
      })}
    </Suspense>
  );
};

export default HomeScene;
