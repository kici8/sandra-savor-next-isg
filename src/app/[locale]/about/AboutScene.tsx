"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";

type AboutSceneProps = {};

const AboutScene: React.FC<AboutSceneProps> = ({}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full touch-none" ref={wrapperRef}>
      <Canvas
        className=" -none"
        camera={{ isPerspectiveCamera: true, position: [0, 0, 10] }}
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[2, 4, 32]} intensity={2.6} />
        <AboutImage wrapperRef={wrapperRef} />
      </Canvas>
    </div>
  );
};

export default AboutScene;

type AboutImageProps = {
  wrapperRef: RefObject<HTMLDivElement | null>;
};

const AboutImage = ({ wrapperRef }: AboutImageProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const { camera } = useThree();

  // Calcolo dimensioni card
  let cardHeight = 1;
  if ("fov" in camera) {
    const vFov = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z);
    cardHeight = visibleHeight * 0.67;
  } else if ("top" in camera && "bottom" in camera) {
    cardHeight = Math.abs(camera.top - camera.bottom) * 0.8;
  }
  const cardWidth = cardHeight * 0.75;

  // Carica la texture
  const image = new THREE.TextureLoader().load("/images/about.jpg");

  const originalPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    // Center of the page
    let canvasCenterX = window.innerWidth / 2;
    let canvasCenterY = window.innerHeight / 2;

    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      canvasCenterX = rect.left + rect.width / 2;
      canvasCenterY = rect.top + rect.height / 2;
    }

    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const meshPositionArray = posAttr.array;

    // Salva le posizioni originali solo una volta
    if (!originalPositions.current) {
      originalPositions.current = Float32Array.from(meshPositionArray);
    }
    const orig = originalPositions.current;

    // Animazione vento
    const time = performance.now() * 0.003;
    const windStrength = 0.2;

    for (let i = 0; i < meshPositionArray.length; i += 3) {
      const x = orig[i];
      const y = orig[i + 1];
      const z = orig[i + 2];

      // Mappa la posizione del mouse nelle coordinate della card
      let mouseCardX = 0;
      let mouseCardY = 0;
      if (rect) {
        mouseCardX =
          ((mouseRef.current.x - rect.left) / rect.width - 0.5) * cardWidth;
        mouseCardY =
          ((mouseRef.current.y - rect.top) / rect.height - 0.5) * cardHeight;
      }

      // Calcola la distanza tra il vertice e il mouse (in coordinate card)
      const dist = Math.sqrt((x - mouseCardX) ** 2 + (-y - mouseCardY) ** 2);

      const maxInflate = 0.8;
      const minInflate = 0.2;
      const influenceRadius = cardWidth * 1.2;
      const normalizedDist = Math.min(dist / influenceRadius, 1);
      const inflate =
        minInflate + (1 - normalizedDist) * (maxInflate - minInflate);

      // Effetto vento
      const wind =
        Math.sin(time * 0.2 + x * 0.6 + y * 0.2) * windStrength +
        Math.cos(time * 0.2 + y * 0.6) * windStrength;

      const windedZ = z + wind + inflate;

      meshPositionArray[i] = x;
      meshPositionArray[i + 1] = y;
      meshPositionArray[i + 2] = windedZ;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} receiveShadow castShadow>
      <planeGeometry args={[cardWidth, cardHeight, 32, 40]} />
      <meshStandardMaterial map={image} side={THREE.DoubleSide} />
    </mesh>
  );
};
