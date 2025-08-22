"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RefObject, Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type SiparioProps = {};

const Sipario: React.FC<SiparioProps> = ({}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full w-full touch-none" ref={wrapperRef}>
      <Suspense fallback={null}>
        <Canvas camera={{ isPerspectiveCamera: true, position: [0, 0, 10] }}>
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
  const pathname = usePathname();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

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

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      timelineRef.current?.kill();
    };
  }, []);

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

  useFrame(() => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.attributes.position;
    const meshPositionArray = posAttr.array;

    // Salva le posizioni originali solo una volta
    if (!originalPositions.current) {
      originalPositions.current = Float32Array.from(meshPositionArray);
    }
    const orig = originalPositions.current;
    const time = performance.now() * 0.004;
    const windStrength = 0.3;

    for (let i = 0; i < meshPositionArray.length; i += 3) {
      const x = orig[i];
      const y = orig[i + 1];
      const z = orig[i + 2];

      // Effetto vento
      const wind =
        Math.sin(time * 0.4 + x * 0.6 + y * 0.4) * windStrength +
        Math.cos(time * 0.02 + y * 0.02) * windStrength;

      const windedZ = z + wind;

      meshPositionArray[i] = x;
      meshPositionArray[i + 1] = y;
      meshPositionArray[i + 2] = windedZ;
    }

    posAttr.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[cardWidth, cardHeight, 32, 40]} />
      <meshStandardMaterial map={image} side={THREE.DoubleSide} />
    </mesh>
  );
};
