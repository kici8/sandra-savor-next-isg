"use client";

import { useGSAP } from "@gsap/react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshEffectContext } from "./useSiparioEffectsManager";
import { useSiparioEffects } from "./SiparioEffectsProvider";
import { curlEffect } from "./curlEffect";
import { DoubleSideImage } from "./doubleSideImage";
import { inflateOnMouseEffect } from "./inflateOnMouseEffect";
import { windEffect } from "./windEffect";

type SiparioImageProps = {
  wrapperRef: RefObject<HTMLDivElement | null>;
  imageUrl: string;
};

export const SiparioImage = ({ wrapperRef, imageUrl }: SiparioImageProps) => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const meshRef = useRef<THREE.Mesh>(null!);
  const pathname = usePathname();

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const {
    addEffect,
    applyEffects,
    updateEffect,
    registerMesh,
    unregisterMesh,
  } = useSiparioEffects();

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

  // Carica la texture
  // TODO: remove
  // const image = new THREE.TextureLoader().load(imageUrl);

  const originalPositions = useRef<Float32Array | null>(null);

  // Mouse tracking
  useEffect(() => {
    if (meshRef.current) {
      registerMesh(imageUrl, meshRef);
    }

    // Mouse tracking
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);

    // Timeline setup
    timelineRef.current = gsap.timeline();

    // Add initial effects
    addEffect({
      name: "wind",
      effect: windEffect(0.6),
      strength: 0,
    });
    addEffect({
      name: "inflate",
      effect: inflateOnMouseEffect(0.1, 1, 0.6),
      strength: 0,
    });
    addEffect({
      name: "curve",
      effect: curlEffect(60),
      strength: 0,
    });

    // Cleanup
    return () => {
      unregisterMesh(imageUrl);
      window.removeEventListener("mousemove", handleMouseMove);
      timelineRef.current?.kill();
    };
  }, [addEffect, imageUrl, registerMesh, unregisterMesh]);

  // Animation functions
  // const animateToWorks = () => {
  //   if (!meshRef.current) return;
  //   timelineRef.current?.clear();
  //   timelineRef.current?.to(meshRef.current?.rotation, {
  //     x: 0,
  //     y: 0,
  //     z: Math.PI / 6,
  //     duration: 0.8,
  //     ease: "power2.out",
  //   });
  // };

  // const animateToAbout = () => {
  //   if (!meshRef.current) return;
  //   timelineRef.current?.clear();
  //   timelineRef.current?.to(meshRef.current?.rotation, {
  //     x: 0,
  //     y: Math.PI / 8,
  //     z: 0,
  //     duration: 0.8,
  //     ease: "power2.out",
  //   });
  // };

  // const animateToHome = () => {
  //   if (!meshRef.current) return;
  //   timelineRef.current?.clear();
  //   timelineRef.current?.to(meshRef.current?.rotation, {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //     duration: 0.8,
  //     ease: "power2.out",
  //   });
  // };

  // PATHNAME EVENT
  // Pathname change effect
  // TODO: What if i want an animation that depends on the previous pathname?
  // I think i need a global state to store the previous pathname
  // Maybe an animation orchestrator
  // Every page has to have:
  // default animation (when coming from the same page or from outside the app)
  // an animation for every other page (when coming from another page of the app)
  // TODO: how to check for dynamic routes like /works/[slug]?
  // useGSAP(
  //   () => {
  //     if (!meshRef.current) return;
  //     if (pathname.includes("/works")) {
  //       animateToWorks();
  //     } else if (pathname.includes("/about")) {
  //       animateToAbout();
  //     } else if (pathname === "/it" || pathname === "/en") {
  //       animateToHome();
  //     }
  //   },
  //   { dependencies: [pathname] },
  // );

  // ONCLICK EVENT
  // OnClick event are used for animate before navigate to a new page
  // TODO: check if ok to simply declare the timeline inside a callback
  // const handleTestTimelineOnClick = () => {
  //   console.log("click");
  //   updateEffect({
  //     name: "curve",
  //     strength: Math.random(),
  //     duration: 0.6,
  //     ease: "cubic-bezier(0.2,0.75,0.8,0.15);",
  //   });
  // };

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

      [x, y, z] = applyEffects({
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
    // eslint-disable-next-line jsx-a11y/alt-text
    <DoubleSideImage
      ref={meshRef}
      // onClick={handleTestTimelineOnClick}
      imageUrl={imageUrl}
      solidColor="#ff00ff"
    >
      <planeGeometry args={[cardWidth, cardHeight, 24, 24]} />
    </DoubleSideImage>
  );
};
