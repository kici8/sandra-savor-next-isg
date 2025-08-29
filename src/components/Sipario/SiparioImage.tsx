"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { useSiparioEffects } from "./SiparioEffectsProvider";
import { curlEffect } from "./curlEffect";
import { DoubleSideImage } from "./doubleSideImage";
import { inflateOnMouseEffect } from "./inflateOnMouseEffect";
import {
  MeshEffectContext,
  MeshEffectWrapper,
} from "./useSiparioEffectsManager";
import { windEffect } from "./windEffect";

type SiparioImageProps = {
  wrapperRef: RefObject<HTMLDivElement | null>;
  imageUrl: string;
};

export const SiparioImage = ({ wrapperRef, imageUrl }: SiparioImageProps) => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const effectsRef = useRef<MeshEffectWrapper[]>([]);
  const originalPositions = useRef<Float32Array | null>(null);

  const { addEffect, registerMesh, unregisterMesh, applyEffects } =
    useSiparioEffects();

  // Calcolo dimensioni card

  const { camera } = useThree();
  let cardHeight = 1;
  if ("fov" in camera) {
    const vFov = (camera.fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z);
    cardHeight = visibleHeight * 0.67;
  } else if ("top" in camera && "bottom" in camera) {
    cardHeight = Math.abs(camera.top - camera.bottom) * 0.8;
  }
  const cardWidth = cardHeight * 0.75;

  // Mouse tracking
  useEffect(() => {
    // Register mesh on mount
    if (meshRef.current && groupRef.current) {
      registerMesh({
        siparioImageId: imageUrl,
        meshRef,
        effectsRef: effectsRef,
        transformationContainerRef: groupRef,
      });
    }

    // Mouse tracking
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);

    // Add initial effects
    addEffect(imageUrl, {
      name: "wind",
      effect: windEffect(0.6),
      strength: 0,
    });
    addEffect(imageUrl, {
      name: "inflate",
      effect: inflateOnMouseEffect(0.1, 1, 0.6),
      strength: 0,
    });
    addEffect(imageUrl, {
      name: "curve",
      effect: curlEffect(90),
      strength: 0,
    });

    // Cleanup
    return () => {
      unregisterMesh(imageUrl);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [addEffect, imageUrl, registerMesh, unregisterMesh]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const meshPositionArray = posAttr.array;

    if (!originalPositions.current) {
      originalPositions.current = Float32Array.from(meshPositionArray);
    }
    const orig = originalPositions.current;

    const ctx: MeshEffectContext = {
      time: state.clock.elapsedTime,
      cardWidth,
      cardHeight,
      mouse: mouseRef.current,
      rect: wrapperRef.current?.getBoundingClientRect(),
    };

    for (let i = 0; i < meshPositionArray.length; i += 3) {
      let x = orig[i];
      let y = orig[i + 1];
      let z = orig[i + 2];

      [x, y, z] = applyEffects(imageUrl, {
        bufferIndex: i,
        context: ctx,
        orig,
        strength: 1,
        x,
        y,
        z,
      });

      meshPositionArray[i] = x;
      meshPositionArray[i + 1] = y;
      meshPositionArray[i + 2] = z;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <DoubleSideImage
        ref={meshRef}
        // onClick={handleTestTimelineOnClick}
        imageUrl={imageUrl}
        solidColor="#ffffff"
      >
        <planeGeometry args={[cardWidth, cardHeight, 24, 24]} />
      </DoubleSideImage>
    </group>
  );
};
