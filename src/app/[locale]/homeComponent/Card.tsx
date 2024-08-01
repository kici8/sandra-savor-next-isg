import { shaderMaterial } from "@react-three/drei";
import {
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
} from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";
import { useGesture } from "@use-gesture/react";

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
  // Hooks
  const ref = useRef<THREE.Mesh>(null);
  const cardShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const positionY = -index * cardHeightWithGap + cardHeightWithGap;
  const wrapAroundOffset = 1.5;
  const totalHeight = totalNumberOfCards * cardHeightWithGap;

  const wheelFriction = 0.025;
  const dragFriction = 0.1;
  const wheelMultiplier = 0.01;
  const dragMultiplier = -0.005;

  const scrollData = useRef<{
    current: number;
    target: number;
    activeEvent: "wheel" | "drag";
  }>({
    current: 0,
    target: 0,
    activeEvent: "wheel",
  });

  useGesture(
    {
      onWheel: ({ delta: [, dy] }) => {
        scrollData.current.activeEvent = "wheel";
        scrollData.current.target += dy * wheelMultiplier;
      },
      onDrag: ({ delta: [, dy] }) => {
        if (containerRef.current) {
          scrollData.current.activeEvent = "drag";
          scrollData.current.target += dy * dragMultiplier;
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

  useFrame(() => {
    const { current, target } = scrollData.current;
    // Smoothly interpolate the current scroll position towards the target
    const friction =
      scrollData.current.activeEvent === "wheel" ? wheelFriction : dragFriction;
    scrollData.current.current += (target - current) * friction;

    if (ref.current) {
      // Update the position of the referenced object based on the current scroll position
      // And handle the wrap-around effect when the scroll position exceeds the total number of pages
      ref.current.position.y =
        ((((positionY + current + wrapAroundOffset) % totalHeight) +
          totalHeight) %
          totalHeight) -
        wrapAroundOffset;
    }
  });

  const [image] = useLoader(THREE.TextureLoader, [url]);

  return (
    <mesh ref={ref} position={[0, positionY, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[cardWidth, cardHeight, 9, 12]} />
      <cardShaderMaterial
        uFirstRow={0.5}
        uTexture={image}
        ref={cardShaderMaterialRef}
        // wireframe
      />
    </mesh>
  );
};

const CardShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uFirstRow: 0.1,
  },
  // Vertex shader
  vertexShader,
  // Fragment shader
  fragmentShader,
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cardShaderMaterial: {
        uTexture: THREE.Texture;
        uFirstRow: number;
      } & ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

extend({ CardShaderMaterial });
