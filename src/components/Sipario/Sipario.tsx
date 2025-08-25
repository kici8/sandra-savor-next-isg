"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import { RefObject, Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { MeshEffectContext } from "./EffectsManager";
import { inflateOnMouseEffect } from "./inflateOnMouseEffect";
import { windEffect } from "./windEffect";
import { useSiparioEffects } from "./EffectsProvider";
import { curlEffect } from "./curlEffect";
import { CameraControls } from "@react-three/drei";

type SiparioProps = {};

const Sipario: React.FC<SiparioProps> = ({}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full" ref={wrapperRef}>
      <Suspense fallback={null}>
        <Canvas camera={{ isPerspectiveCamera: true, position: [0, 0, 10] }}>
          {/* <CameraControls /> */}
          <ambientLight intensity={1.6} />
          <directionalLight position={[2, 4, 32]} intensity={2.6} />
          <SiparioImage wrapperRef={wrapperRef} />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default Sipario;

type SiparioImageProps = {
  wrapperRef: RefObject<HTMLDivElement | null>;
};

const SiparioImage = ({ wrapperRef }: SiparioImageProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouseRef = useRef({ x: 0, y: 0 });

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const effectsManager = useSiparioEffects();

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
  const image = new THREE.TextureLoader().load("/images/about.jpg");

  const originalPositions = useRef<Float32Array | null>(null);

  // Mouse tracking
  useEffect(() => {
    // Mouse tracking
    function handleMouseMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    window.addEventListener("mousemove", handleMouseMove);

    // Timeline setup
    timelineRef.current = gsap.timeline();

    // Add initial effects
    effectsManager.addEffect({
      name: "wind",
      effect: windEffect(0.6),
      strength: 0,
    });
    effectsManager.addEffect({
      name: "inflate",
      effect: inflateOnMouseEffect(0.1, 1, 0.6),
      strength: 0,
    });
    effectsManager.addEffect({
      name: "curve",
      effect: curlEffect(60),
      strength: 0,
    });

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      timelineRef.current?.kill();
    };
  }, [effectsManager]);

  // Animation functions
  const animateToWorks = () => {
    timelineRef.current?.clear();
    timelineRef.current?.to(meshRef.current?.rotation, {
      x: 0,
      y: 0,
      z: Math.PI / 6,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const animateToAbout = () => {
    timelineRef.current?.clear();
    timelineRef.current?.to(meshRef.current?.rotation, {
      x: 0,
      y: Math.PI / 8,
      z: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const animateToHome = () => {
    timelineRef.current?.clear();
    timelineRef.current?.to(meshRef.current?.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  // Pathname change effect
  useGSAP(
    () => {
      if (!meshRef.current) return;
      if (pathname.includes("/works")) {
        animateToWorks();
      } else if (pathname.includes("/about")) {
        animateToAbout();
      } else if (pathname === "/it" || pathname === "/en") {
        animateToHome();
      }
    },
    { dependencies: [pathname] },
  );

  // TODO: check if ok to simply declare the timeline inside a callback
  const handleTestTimelineOnClick = () => {
    console.log("click");
    effectsManager.updateEffect({
      name: "curve",
      strength: Math.random(),
      duration: 0.6,
      ease: "cubic-bezier(0.2,0.75,0.8,0.15);",
    });
  };

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

      [x, y, z] = effectsManager.applyEffects({
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
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onClick={handleTestTimelineOnClick}
    >
      <planeGeometry args={[cardWidth, cardHeight, 64, 64]} />
      <meshStandardMaterial map={image} side={THREE.DoubleSide} />
    </mesh>
  );
};
