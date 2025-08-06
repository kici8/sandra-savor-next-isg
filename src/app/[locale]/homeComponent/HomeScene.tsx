"use client";

import { WorksForHomeQuery } from "@/graphql/generated/graphql";
import { Backdrop, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef, useState } from "react";
import { ScrollContainer } from "./ScrollContainer";

type HomeSceneProps = {
  works: WorksForHomeQuery["works"];
};

export type SimpleWork = {
  title: string;
  slug: string;
  coverUrl: string;
};

const HomeScene: React.FC<HomeSceneProps> = ({ works }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [activeCard, setActiveCard] = useState<SimpleWork | null>(null);

  const filteredWorks: SimpleWork[] = [];

  works?.data.forEach((work) => {
    const firstImage = work.attributes?.images.data[0].attributes?.url;
    const title = work.attributes?.title;
    const slug = work.attributes?.slug;
    if (firstImage && title && slug) {
      filteredWorks.push({
        title,
        slug,
        coverUrl: firstImage,
      });
    }
  });

  const handleActiveCard = (index: number) => {
    setActiveCard(filteredWorks[index] || null);
  };

  const handleNavigate = (slug: string) => {
    setTimeout(() => {
      // TODO: locale
      window.location.href = `it/works/${slug}`;
    }, 1200);
  };

  return (
    <>
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
          <ScrollContainer
            works={filteredWorks}
            containerRef={wrapperRef}
            setActiveCard={handleActiveCard}
          />
        </Canvas>
      </div>
      <div className="absolute left-12 top-1/2 flex -translate-y-1/2 transform flex-col gap-1">
        {filteredWorks.map((work) => (
          <button onClick={() => handleNavigate(work.slug)} key={work.slug}>
            <h2 className="text-sm font-bold">
              {work.title}
              {activeCard?.slug === work.slug ? "*" : null}
            </h2>
          </button>
        ))}
      </div>
    </>
  );
};

export default HomeScene;
