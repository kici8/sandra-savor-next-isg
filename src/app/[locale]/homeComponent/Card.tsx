import { shaderMaterial } from "@react-three/drei";
import {
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
} from "@react-three/fiber";
import normalizeWheel from "normalize-wheel";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";

type CardProps = {
  url: string;
  cardWidth: number;
  cardHeight: number;
  cardHeightWithGap: number;
  totalNumberOfCards: number;
  pages: number;
  index: number;
};

export const Card: React.FC<CardProps> = ({
  url,
  cardWidth,
  cardHeight,
  cardHeightWithGap,
  totalNumberOfCards,
  pages,
  index,
}) => {
  // Hooks
  const ref = useRef<THREE.Mesh>(null);
  const cardShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const positionY = -index * cardHeightWithGap + cardHeightWithGap;
  const wrapAroundOffset = 1.5;
  const totalHeight = totalNumberOfCards * cardHeightWithGap;

  // Handle scroll
  const scrollData = useRef({
    multiplier: 0.005, // Multiplier to control scroll sensitivity
    ease: 0.02, // Ease factor to control the smoothness of the scroll
    current: 0, // Current scroll position
    target: 0, // Target scroll position
  });

  useEffect(() => {
    // Event handler for the wheel event
    const onWheelHandler = (e: WheelEvent) => {
      const { pixelY } = normalizeWheel(e); // Normalize the wheel event data
      const { target, multiplier } = scrollData.current;

      // Update the target scroll position based on the wheel movement
      scrollData.current.target = target + pixelY * multiplier;
    };

    const onTouchDown = (e: MouseEvent) => {};
    const onTouchMove = (e: MouseEvent) => {};
    const onTouchUp = (e: MouseEvent) => {};

    // Add the wheel event listener
    window.addEventListener("wheel", onWheelHandler);
    // Add the touch event listeners
    window.addEventListener("mousedown", onTouchDown);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchUp);
    // Remove the wheel event listener when the component unmounts
    return () => {
      window.removeEventListener("wheel", onWheelHandler);
    };
  }, []);

  useFrame(() => {
    const { ease, current, target } = scrollData.current;
    // Smoothly interpolate the current scroll position towards the target
    scrollData.current.current += (target - current) * ease;

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
