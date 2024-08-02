import { useRef, useEffect } from "react";
import {
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
} from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";
import { useTransform, useMotionValue } from "framer-motion";

type CardProps = {
  url: string;
  cardWidth: number;
  cardHeight: number;
  cardHeightWithGap: number;
  totalNumberOfCards: number;
  pages: number;
  index: number;
  containerRef: React.RefObject<HTMLDivElement>;
};

export const Card: React.FC<CardProps> = ({
  url,
  cardWidth,
  cardHeight,
  cardHeightWithGap,
  totalNumberOfCards,
  pages,
  containerRef,
  index,
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const cardShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const positionY = -index * cardHeightWithGap + cardHeightWithGap;
  const wrapAroundOffset = 1.5;
  const totalHeight = totalNumberOfCards * cardHeightWithGap;

  const wheelFriction = 0.025;
  const dragFriction = 0.1;
  const wheelMultiplier = 0.01;
  const dragMultiplier = 0.005;

  const scrollData = useRef<{
    current: number;
    target: number;
    previous: number;
    activeEvent: "wheel" | "drag";
    direction: 1 | -1;
  }>({
    current: 0,
    target: 0,
    previous: 0,
    activeEvent: "wheel",
    direction: 1,
  });

  const speed = useMotionValue(0);
  const transformedSpeed = useTransform(
    speed,
    [0, 10],
    // Into these values:
    [0, 1],
  );

  const setLastDirection = (number: number) => {
    if (number === 0) return;
    const direction =
      scrollData.current.activeEvent === "wheel" ? number : -number;
    scrollData.current.direction = direction > 0 ? 1 : -1;
  };

  useGesture(
    {
      onWheel: ({ delta: [, dy] }) => {
        scrollData.current.activeEvent = "wheel";
        scrollData.current.target += dy * wheelMultiplier;
        setLastDirection(dy);
      },
      onDrag: ({ delta: [, dy] }) => {
        if (containerRef.current) {
          scrollData.current.activeEvent = "drag";
          scrollData.current.target += dy * dragMultiplier * -1;
          setLastDirection(dy);
        }
      },
    },
    {
      target: containerRef,
      eventOptions: {
        passive: false,
      },
    },
  );

  useFrame((state, delta) => {
    const { current, target, previous } = scrollData.current;
    const friction =
      scrollData.current.activeEvent === "wheel" ? wheelFriction : dragFriction;
    scrollData.current.current += (target - current) * friction;

    // Calculate speed
    const difference = Math.abs(current - previous);
    // Threshold to avoid js approximation errors
    if (difference > 0.000001) {
      speed.set(difference / delta);
    } else {
      speed.set(0);
    }
    scrollData.current.previous = current;

    // Update card position
    if (ref.current) {
      ref.current.position.y =
        ((((positionY + current + wrapAroundOffset) % totalHeight) +
          totalHeight) %
          totalHeight) -
        wrapAroundOffset;
    }

    // Update shader material
    if (cardShaderMaterialRef.current) {
      cardShaderMaterialRef.current.uniforms.uDirection.value =
        scrollData.current.direction;
      cardShaderMaterialRef.current.uniforms.uSpeed.value =
        transformedSpeed.get();
    }
  });

  const [image] = useLoader(THREE.TextureLoader, [url]);

  return (
    <mesh ref={ref} position={[0, positionY, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[cardWidth, cardHeight, 9, 12]} />
      <cardShaderMaterial
        uDirection={1}
        uSpeed={0.0}
        uTexture={image}
        ref={cardShaderMaterialRef}
      />
    </mesh>
  );
};

const CardShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uDirection: 1,
    uSpeed: 0.0,
  },
  vertexShader,
  fragmentShader,
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cardShaderMaterial: {
        uTexture: THREE.Texture;
        uDirection: number;
        uSpeed: number;
      } & ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

extend({ CardShaderMaterial });
