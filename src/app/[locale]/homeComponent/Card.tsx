import {
  CurveModifierRef,
  Line,
  shaderMaterial,
  Text,
} from "@react-three/drei";
import {
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
} from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useMotionValue, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const cardGroupRef = useRef<THREE.Group>(null);
  const cardMeshRef = useRef<THREE.Mesh>(null);
  const cardShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const isDragging = useRef(false);
  const curveRef = useRef<CurveModifierRef>(null);
  const positionY = -index * cardHeightWithGap + cardHeightWithGap;
  const xOffset = 0.2;
  const positionX = xOffset * positionY;

  const wrapAroundOffset = 1.5;
  const totalHeight = totalNumberOfCards * cardHeightWithGap;

  const wheelFriction = 0.03;
  const dragFriction = 0.03;
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

  // GESTURE AND SNAP
  const snapTarget = useRef<number | null>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const isOriginalPositionCreated = useRef(false);
  const speed = useMotionValue(0);
  const transformedSpeed = useTransform(
    speed,
    [0, 10],
    // Into these values:
    [0, 1],
  );

  // CURVE
  const curveNumPoints = 12;
  const curveRadius = cardWidth / 2;

  const curvePoints = Array.from({ length: curveNumPoints }, (_, i) => {
    const angle = (i / curveNumPoints) * Math.PI * 2;
    const v = new THREE.Vector3(
      Math.cos(angle) * curveRadius,
      Math.sin(angle) * curveRadius,
      0,
    );
    return v;
  });

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
        curveRef.current?.moveAlongCurve(0.01);
        setLastDirection(dy);
      },
      onDrag: ({ dragging, delta: [, dy] }) => {
        isDragging.current = dragging || false;
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
    if (difference > 0.000001) {
      speed.set(difference / delta);
    } else {
      speed.set(0);
    }
    scrollData.current.previous = current;

    // SNAP LOGIC
    const snapThreshold = 0.05;

    if (speed.get() < snapThreshold && !isDragging.current) {
      if (snapTarget.current === null) {
        // Compute the closest card only once
        const centerPositions = Array.from(
          { length: totalNumberOfCards },
          (_, i) => {
            const base = -i * cardHeightWithGap + cardHeightWithGap;
            return (
              ((((base + current + wrapAroundOffset) % totalHeight) +
                totalHeight) %
                totalHeight) -
              wrapAroundOffset
            );
          },
        );
        let closest = centerPositions[0];
        let minDist = Math.abs(closest);
        let closestIndex = 0;
        centerPositions.forEach((pos, i) => {
          const dist = Math.abs(pos);
          if (dist < minDist) {
            minDist = dist;
            closest = pos;
            closestIndex = i;
          }
        });
        // Store the snap target
        snapTarget.current = scrollData.current.current + -closest;
      }
      // Snap towards the stored target
      scrollData.current.target = snapTarget.current;
    } else {
      // If user interacts or speed increases, reset snapTarget
      snapTarget.current = null;
    }

    // UPDATE CARD
    if (cardGroupRef.current) {
      // Position
      const y =
        ((((positionY + current + wrapAroundOffset) % totalHeight) +
          totalHeight) %
          totalHeight) -
        wrapAroundOffset;
      const x = 0.2 * y;
      cardGroupRef.current.position.y = y;
      cardGroupRef.current.position.x = x;
      // Rotation
      cardGroupRef.current.rotation.y = y;
    }

    if (cardMeshRef.current) {
      if (!isOriginalPositionCreated.current) {
        // Create original positions only once
        originalPositions.current = Float32Array.from(
          cardMeshRef.current.geometry.attributes.position.array,
        );
        isOriginalPositionCreated.current = true;
      }

      if (isOriginalPositionCreated && originalPositions.current) {
        // Update mesh to create a smooth curved effect
        const meshPositionArray =
          cardMeshRef.current.geometry.attributes.position.array;

        for (let i = 0; i < meshPositionArray.length; i += 3) {
          const x = originalPositions.current[i];
          const y = originalPositions.current[i + 1];
          const z = originalPositions.current[i + 2];

          // Rotate the point by tot deg around the x axis
          const angle = THREE.MathUtils.degToRad(30);
          const xr = x * Math.cos(angle) - y * Math.sin(angle);
          const yr = x * Math.sin(angle) + y * Math.cos(angle);

          // Apply cylindrical mapping along the new X axis
          const xNorm = xr / (cardWidth / 2);
          const maxAngle = THREE.MathUtils.degToRad(90);
          const radius = cardWidth / maxAngle / 2;
          const theta = xNorm * maxAngle;

          const newXr = radius * Math.sin(theta);
          const newZ = -radius * (1.0 - Math.cos(theta));

          // Rotate back by +45° around Z
          const newX = newXr * Math.cos(-angle) - yr * Math.sin(-angle);
          const newY = newXr * Math.sin(-angle) + yr * Math.cos(-angle);

          meshPositionArray[i] = newX;
          meshPositionArray[i + 1] = newY;
          meshPositionArray[i + 2] = newZ;
        }
        cardMeshRef.current.geometry.attributes.position.needsUpdate = true;
      }
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
    <>
      <axesHelper />
      <group ref={cardGroupRef} position={[positionX, positionY, 0]}>
        <mesh position={[0, 0, 0.2]} ref={cardMeshRef}>
          <planeGeometry args={[cardWidth, cardHeight, 24, 32]} />
          <cardShaderMaterial
            uDirection={1}
            uSpeed={0.0}
            uTexture={image}
            uRectangleWidth={cardWidth}
            ref={cardShaderMaterialRef}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
};

const CardShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uDirection: 1,
    uSpeed: 0.0,
    uRectangleWidth: 0.4,
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
        uRectangleWidth: number;
      } & ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

extend({ CardShaderMaterial });
