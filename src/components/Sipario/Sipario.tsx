"use client";

import { WorksForSiparioImagesQuery } from "@/graphql/generated/graphql";
import { AdaptiveDpr, CameraControls, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { SiparioImages } from "./SiparioImages";

type SiparioProps = {
  works: WorksForSiparioImagesQuery["works"];
};

const Sipario = ({ works }: SiparioProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full" ref={wrapperRef}>
      <Canvas camera={{ isPerspectiveCamera: true, position: [0, 0, 10] }}>
        <Suspense fallback={null}>
          {/* <CameraControls /> */}
          {/* <ambientLight intensity={0.8} />
          <directionalLight position={[2, 4, 32]} intensity={2.6} /> */}
          <SiparioImages wrapperRef={wrapperRef} works={works} />
          <AdaptiveDpr pixelated />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Sipario;
