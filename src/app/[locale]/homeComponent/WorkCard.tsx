"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SimpleWork } from "./HomeScene";

type CardProps = {
  work: SimpleWork;
  index: number;
  cardWidth: number;
  cardHeight: number;
  cardHeightWithGap: number;
  totalNumberOfCards: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setActiveCard: (index: number) => void;
  handleClick: (index: number) => void;
};

// FIXME:
// The start animation is not that good
// There is a flash at the start when the cards are in position and then the animation start
// the start animation block and is blocked by the scroll
// // this is very annoying, especially when navigating back and forth
// we need a transition or a leaving animation when clicking on a card
// we need simplify this mess

export const WorkCard: React.FC<CardProps> = ({
  work,
  index,
  cardWidth,
  cardHeight,
  cardHeightWithGap,
  totalNumberOfCards,
  containerRef,
  setActiveCard,
  handleClick,
}) => {
  const cardGroupRef = useRef<THREE.Group>(null);
  const cardMeshRef = useRef<THREE.Mesh>(null);
  const cardMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const isDragging = useRef(false);
  const positionY = -index * cardHeightWithGap + cardHeightWithGap;

  const wrapAroundOffset = 1.5;
  const totalHeight = totalNumberOfCards * cardHeightWithGap;

  const wheelFriction = 0.04;
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
  const smoothedCurvature = useRef(0);
  const speed = useRef(0);
  const transformedSpeed = useRef(0);

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

  useFrame((_state, delta) => {
    // Control the scroll speed
    // TODO: maybe we need a way for normalize speed/friction for trackPad?
    const { current, target, previous } = scrollData.current;
    const friction =
      scrollData.current.activeEvent === "wheel" ? wheelFriction : dragFriction;
    scrollData.current.current += (target - current) * friction;

    const difference = Math.abs(current - previous);
    if (difference > 0.0001) {
      speed.current = difference / delta;
    } else {
      speed.current = 0;
    }
    scrollData.current.previous = current;

    // Update transformedSpeed (mapping 0-10 to 0-1)
    transformedSpeed.current = Math.max(0, Math.min(1, speed.current / 10));

    // SNAP LOGIC
    const snapThreshold = 0.05;
    if (speed.current < snapThreshold && !isDragging.current) {
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

        // Set the active card
        setActiveCard(closestIndex);
      }
      // Snap towards the stored target
      scrollData.current.target = snapTarget.current;
    } else {
      // If user interacts or speed increases, reset snapTarget
      snapTarget.current = null;
    }

    // ROTATION
    const rotationY =
      ((((positionY + current + wrapAroundOffset) % totalHeight) +
        totalHeight) %
        totalHeight) -
      wrapAroundOffset;

    // UPDATE CARD GROUP
    if (cardGroupRef.current) {
      const x = 0.12 * rotationY;
      cardGroupRef.current.position.y = rotationY;
      cardGroupRef.current.position.x = x;
      // Rotation
      cardGroupRef.current.rotation.y = rotationY;
    }

    // UPDATE MESH

    // get the curvature from the speed
    const smoothCurvatureTarget = transformedSpeed.current;
    smoothedCurvature.current +=
      (smoothCurvatureTarget - smoothedCurvature.current) * 0.02;

    if (cardMeshRef.current) {
      if (!isOriginalPositionCreated.current) {
        // Create original positions only once (copy without the reference)
        // I think I'm updating the cardMeshRef position in a wrong way, but updating the original positions works
        originalPositions.current = Float32Array.from(
          cardMeshRef.current.geometry.attributes.position.array,
        );
        isOriginalPositionCreated.current = true;
      }

      if (isOriginalPositionCreated && originalPositions.current) {
        const meshPositionArray =
          cardMeshRef.current.geometry.attributes.position.array;
        const maxStaticCurvature = 0.5;
        const normalizedRotationY = Math.min(Math.abs(rotationY) / Math.PI, 1);
        const staticCurvature = maxStaticCurvature * normalizedRotationY;
        const curvature = Math.min(
          staticCurvature + smoothedCurvature.current,
          1,
        );
        const maxAngle = THREE.MathUtils.degToRad(90) * curvature;
        const minAngle = 0.0001;
        const safeMaxAngle = Math.max(maxAngle, minAngle);
        const radius = cardWidth / safeMaxAngle / 2;

        for (let i = 0; i < meshPositionArray.length; i += 3) {
          // Bend the card
          const x = originalPositions.current[i];
          const y = originalPositions.current[i + 1];
          // const z = originalPositions.current[i + 2];
          const angle = Math.PI / 4;
          const xr = x * Math.cos(angle) - y * Math.sin(angle);
          const yr = x * Math.sin(angle) + y * Math.cos(angle);

          const xNorm = xr / (cardWidth / 2);
          const theta = xNorm * safeMaxAngle;

          const newXr = radius * Math.sin(theta);
          const newZ = -radius * (1.0 - Math.cos(theta));

          // wind
          const time = performance.now() * 0.001;
          const windStrength = 0.02;
          const wind =
            Math.sin(time * 2 + x * 3 + y * 2) * windStrength +
            Math.cos(time * 1.5 + y * 2) * windStrength * 0.5;
          const windX = wind * 0.2;
          const windY = wind * 0.2;
          const windedZ = newZ + wind;

          // Update all
          const newX = newXr * Math.cos(-angle) - yr * Math.sin(-angle) + windX;
          const newY = newXr * Math.sin(-angle) + yr * Math.cos(-angle) + windY;
          meshPositionArray[i] = newX;
          meshPositionArray[i + 1] = newY;
          meshPositionArray[i + 2] = windedZ;
        }
        // Call the update
        cardMeshRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  const [image] = useLoader(THREE.TextureLoader, [work.coverUrl]);

  return (
    <group ref={cardGroupRef}>
      <mesh
        ref={cardMeshRef}
        position={[0, 0, 0.6]}
        receiveShadow
        castShadow
        onClick={() => {
          handleClick(index);
        }}
      >
        <planeGeometry args={[cardWidth, cardHeight, 24, 32]} />
        <meshStandardMaterial
          map={image}
          side={THREE.DoubleSide}
          ref={cardMaterialRef}
        />
      </mesh>
    </group>
  );
};
