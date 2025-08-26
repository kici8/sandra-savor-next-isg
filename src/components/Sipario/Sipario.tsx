"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { SiparioImages } from "./SiparioImages";
import { WorksForSiparioImagesQuery } from "@/graphql/generated/graphql";

type SiparioProps = {
  works: WorksForSiparioImagesQuery["works"];
};

const Sipario = ({ works }: SiparioProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full" ref={wrapperRef}>
      <Suspense fallback={null}>
        <Canvas camera={{ isPerspectiveCamera: true, position: [0, 0, 10] }}>
          {/* <CameraControls /> */}
          <ambientLight intensity={1.6} />
          <directionalLight position={[2, 4, 32]} intensity={2.6} />
          <SiparioImages wrapperRef={wrapperRef} works={works} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Sipario;
