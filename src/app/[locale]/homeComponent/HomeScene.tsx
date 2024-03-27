"use client";

import * as THREE from "three";
import { Image, ScrollControls, useScroll } from "@react-three/drei";
import { Canvas, GroupProps, ThreeEvent, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef, useState } from "react";
import { Group, Mesh, Object3DEventMap } from "three";
import { useControls } from "leva";

type HomeSceneProps = {
  imagesUrl: string[];
};

const HomeScene: React.FC<HomeSceneProps> = ({ imagesUrl }) => {
  const controlledValues = useControls({
    carouselRadius: { value: 2.4, min: 0, max: 25, step: 0.1 },
    rigR_X: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    rigR_Y: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    rigR_Z: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    rigVelocity: { value: 2, min: 0, max: 5, step: 0.1 },
    scrollMaxSpeed: { value: 0.1, min: 0, max: 1, step: 0.01 },
    scrollDamping: { value: 1, min: 0, max: 100, step: 1 },
  });

  return (
    <Canvas camera={{ position: [0, 0, 100], fov: 15 }}>
      {/* <fog attach="fog" args={["#a79", 8.5, 12]} /> */}
      <ScrollControls
        maxSpeed={controlledValues.scrollMaxSpeed}
        damping={controlledValues.scrollDamping}
      >
        <Rig
          rotationVelocity={controlledValues.rigVelocity}
          groupProps={{
            rotation: [
              controlledValues.rigR_X,
              controlledValues.rigR_Y,
              controlledValues.rigR_Z,
            ],
            children: (
              <Carousel
                radius={controlledValues.carouselRadius}
                imagesUlr={imagesUrl}
              />
            ),
          }}
        />
      </ScrollControls>
      {/* <Environment preset="dawn" background blur={0.5} /> */}
    </Canvas>
  );
};

type RigProps = {
  groupProps: GroupProps;
  rotationVelocity: number;
};

const Rig: React.FC<RigProps> = ({ groupProps, rotationVelocity }) => {
  const ref = useRef<Group<Object3DEventMap>>(null);
  const scroll = useScroll();

  useFrame((state, delta) => {
    // Rotate contents
    if (ref.current?.rotation.y !== undefined) {
      ref.current.rotation.y = -scroll.offset * (Math.PI * rotationVelocity);
    }
    // ref.current.rotation.y = -scroll.offset * (Math.PI * 2);

    // Ray-casts every frame rather than on pointer-move
    if (state.events.update) {
      state.events.update();
    }

    // TODO start animation and on mouse position animation
    // Move camera
    easing.damp3(
      state.camera.position,
      [-state.pointer.x * 2, state.pointer.y + 1.5, 10],
      0.3,
      delta,
    );

    // Look at center
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={ref} {...groupProps} />;
};

type CarouselProps = {
  radius?: number;
  imagesUlr: string[];
};

function Carousel({ radius = 2, imagesUlr }: CarouselProps) {
  const count = imagesUlr.length;
  return imagesUlr.map((url, i) => (
    <Card
      key={url}
      url={url}
      position={[
        Math.sin((i / count) * Math.PI * 2) * radius,
        0,
        Math.cos((i / count) * Math.PI * 2) * radius,
      ]}
      rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  ));
}

type CardProps = {
  url: string;
  scale?: number | [number, number];
} & JSX.IntrinsicElements["mesh"];

function Card({ url, scale, ...props }: CardProps) {
  const ref = useRef<Mesh>(null);
  const [hovered, hover] = useState(false);
  const pointerOver = (e: ThreeEvent<PointerEvent>) => (
    e.stopPropagation(), hover(true)
  );
  const pointerOut = () => hover(false);
  useFrame((_, delta) => {
    if (ref.current === null) return;
    // easing.damp3(ref.current?.scale, hovered ? 1.15 : 1, 0.1, delta);
    // easing.damp(
    //   ref.current?.material,
    //   "radius",
    //   hovered ? 0.25 : 0.1,
    //   0.2,
    //   delta,
    // );
    easing.damp(ref.current?.material, "zoom", hovered ? 1 : 1.5, 0.2, delta);
  });
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      ref={ref}
      url={url}
      transparent
      side={THREE.DoubleSide}
      onPointerOver={pointerOver}
      onPointerOut={pointerOut}
      scale={scale}
      {...props}
    >
      {/* <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} /> */}
    </Image>
  );
}

export default HomeScene;
