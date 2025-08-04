"use client";

import { useEffect, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { useGesture } from "@use-gesture/react";
import { useMotionValue, useTransform } from "framer-motion";
import * as THREE from "three";
import { SimpleWork } from "./HomeScene";

type CardProps = {
  work: SimpleWork;
  index: number;
  cardWidth: number;
  cardHeight: number;
  cardHeightWithGap: number;
  totalNumberOfCards: number;
  containerRef: React.RefObject<HTMLDivElement>;
  setActiveCard: (index: number) => void;
  isNavigating: boolean;
};

export const WorkCard: React.FC<CardProps> = ({
  work,
  index,
  cardWidth,
  cardHeight,
  cardHeightWithGap,
  totalNumberOfCards,
  containerRef,
  setActiveCard,
  isNavigating,
}) => {
  // === REFS & CONSTANTS ===
  const cardGroupRef = useRef<THREE.Group>(null);
  const cardMeshRef = useRef<THREE.Mesh>(null);
  const cardMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const isDragging = useRef(false);
  const positionY = -index * cardHeightWithGap + cardHeightWithGap;
  const wrapAroundOffset = 1.5;
  const totalHeight = totalNumberOfCards * cardHeightWithGap;

  // Scroll & snap logic
  const scrollData = useRef({
    current: 0,
    target: 0,
    previous: 0,
    activeEvent: "wheel" as "wheel" | "drag",
    direction: 1 as 1 | -1,
  });
  const snapTarget = useRef<number | null>(null);

  // Card bending
  const originalPositions = useRef<Float32Array | null>(null);
  const isOriginalPositionCreated = useRef(false);
  const smoothedCurvature = useRef(0);

  // Motion values
  const speed = useMotionValue(0);
  const transformedSpeed = useTransform(speed, [0, 10], [0, 1]);

  // === GESTURE HANDLERS ===
  const wheelFriction = 0.04;
  const dragFriction = 0.03;
  const wheelMultiplier = 0.01;
  const dragMultiplier = 0.005;

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
      eventOptions: { passive: false },
    },
  );

  // === FALL ANIMATION (CADUTA) ===
  const fallStartRef = useRef<number | null>(null);
  const fallDuration = 1200; // ms
  const fallDistance = useRef(-6 - Math.random() * 2);

  useEffect(() => {
    if (isNavigating) {
      fallStartRef.current = performance.now();
    }
  }, [isNavigating]);

  // === INITIAL ENTRANCE ANIMATION ===
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1600; // ms

    // Calcola range animazione iniziale
    const startIndex = 0;
    const minCardsToAnimate = totalNumberOfCards >= 6 ? 5 : totalNumberOfCards;
    const maxFinalIndex = Math.min(
      startIndex + minCardsToAnimate - 1,
      totalNumberOfCards - 1,
    );
    const initialTarget = cardHeightWithGap * startIndex;
    const finalTarget = cardHeightWithGap * maxFinalIndex;

    // Z e scala
    const initialZ = -0.2;
    const finalZ = 0.6;
    const initialScale = 0.8;
    const finalScale = 1;

    scrollData.current.current = initialTarget;
    scrollData.current.target = initialTarget;

    function animateFakeScroll(ts: number) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);

      scrollData.current.target =
        initialTarget + (finalTarget - initialTarget) * eased;

      if (cardMeshRef.current) {
        cardMeshRef.current.position.z = initialZ + (finalZ - initialZ) * eased;
        const s = initialScale + (finalScale - initialScale) * eased;
        cardMeshRef.current.scale.set(s, s, s);
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animateFakeScroll);
      } else {
        scrollData.current.target = finalTarget;
        if (cardMeshRef.current) {
          cardMeshRef.current.position.z = finalZ;
          cardMeshRef.current.scale.set(finalScale, finalScale, finalScale);
        }
      }
    }

    frame = requestAnimationFrame(animateFakeScroll);
    return () => cancelAnimationFrame(frame);
  }, [cardHeightWithGap, totalNumberOfCards]);

  // === THREE.JS FRAME LOOP ===
  useFrame((_state, delta) => {
    // --- Scroll physics ---
    const { current, target, previous } = scrollData.current;
    const friction =
      scrollData.current.activeEvent === "wheel" ? wheelFriction : dragFriction;
    scrollData.current.current += (target - current) * friction;

    const difference = Math.abs(current - previous);
    speed.set(difference > 0.0001 ? difference / delta : 0);
    scrollData.current.previous = current;

    // --- Snap logic ---
    const snapThreshold = 0.05;
    if (speed.get() < snapThreshold && !isDragging.current) {
      if (snapTarget.current === null) {
        // Trova la card più vicina al centro
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
        snapTarget.current = scrollData.current.current + -closest;
        setActiveCard(closestIndex);
      }
      scrollData.current.target = snapTarget.current;
    } else {
      snapTarget.current = null;
    }

    // --- Card position & fall ---
    const rotationY =
      ((((positionY + scrollData.current.current + wrapAroundOffset) %
        totalHeight) +
        totalHeight) %
        totalHeight) -
      wrapAroundOffset;

    if (cardGroupRef.current && cardGroupRef.current.position) {
      const x = 0.12 * rotationY;
      cardGroupRef.current.position.x = x;

      // Caduta
      if (isNavigating && fallStartRef.current !== null) {
        const now = performance.now();
        const elapsed = now - fallStartRef.current;
        const progress = Math.min(elapsed / fallDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        cardGroupRef.current.position.y =
          rotationY + fallDistance.current * eased;
      } else if (isNavigating) {
        cardGroupRef.current.position.y = rotationY + fallDistance.current;
      } else {
        cardGroupRef.current.position.y = rotationY;
      }

      cardGroupRef.current.rotation.y = rotationY;
    }

    // --- Card mesh bending ---
    const smoothCurvatureTarget = transformedSpeed.get();
    smoothedCurvature.current +=
      (smoothCurvatureTarget - smoothedCurvature.current) * 0.02;

    if (cardMeshRef.current) {
      if (!isOriginalPositionCreated.current) {
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
        cardMeshRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  // === TEXTURE ===
  const [image] = useLoader(THREE.TextureLoader, [work.coverUrl]);

  // === RENDER ===
  return (
    <group ref={cardGroupRef}>
      <mesh ref={cardMeshRef} position={[0, 0, 0.6]} receiveShadow castShadow>
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
