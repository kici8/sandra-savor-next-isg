"use client";

import { MeshTransmissionMaterial, Plane, Text } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useRef } from "react";
import { Mesh } from "three";

const Scene: React.FC = () => {
  return (
    <Canvas>
      {/* <ambientLight />
      <pointLight position={[10, 10, 10]} /> */}

      {/* <Environment preset="studio" /> */}
      <directionalLight position={[0, 3, 2]} intensity={3} />
      <Plane args={[100, 100]} position={[0, 0, -20]}>
        <meshStandardMaterial color="#000" />
      </Plane>

      <Model />
    </Canvas>
  );
};

export default Scene;

const Model = () => {
  const mesh = useRef<Mesh>(null);
  const { viewport } = useThree();

  const materialProps = useControls({
    thickness: { value: 0.3, min: 0, max: 1, step: 0.05 },
    roughness: { value: 0.05, min: 0, max: 1, step: 0.01 },
    transmission: { value: 0.98, min: 0, max: 1, step: 0.01 },
    ior: { value: 1.2, min: 1, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.04, min: 0, max: 1, step: 0.01 },
  });

  useFrame(() => {
    mesh.current?.rotateX(0.01);
    mesh.current?.rotateY(-0.01);
  });

  return (
    <group>
      <Text scale={viewport.width / 7} position={[0, 0, -0.5]} color="#fff">
        DANGEROUS
      </Text>

      <mesh scale={viewport.width / 5} ref={mesh}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </group>
  );
};
