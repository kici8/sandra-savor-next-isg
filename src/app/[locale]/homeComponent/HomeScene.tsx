"use client";

import { Backdrop, SoftShadows } from "@react-three/drei";
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
      <Canvas
        camera={{ position: [0, 0, 10], fov: 10 }}
        className="touch-none"
        shadows
      >
        <SoftShadows size={36} samples={8} />
        <Backdrop
          floor={1}
          segments={40}
          position={[0, -2.5, 1]}
          scale={[8, 8, 12]}
          receiveShadow
        >
          <meshStandardMaterial color="rgb(255, 247, 237)" />
          <shadowMaterial transparent opacity={0.1} />
        </Backdrop>
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[2, 4, 32]}
          intensity={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.001}
        />
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
  const gap = 0.06;
  const cardHeight = height * cardHeightInViewportPercentage - gap;
  const cardWidth = (cardHeight / 4) * 3;
  const cardHeightWithGap = cardHeight + gap;

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
