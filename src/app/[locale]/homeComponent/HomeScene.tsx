"use client";

import { ScrollControls, shaderMaterial, useScroll } from "@react-three/drei";
import {
  Canvas,
  GroupProps,
  ReactThreeFiber,
  extend,
  useFrame,
  useThree,
  useLoader,
} from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

type HomeSceneProps = {
  imagesUrl: string[];
};

const HomeScene: React.FC<HomeSceneProps> = ({ imagesUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 10, rotation: [0, 0, 0] }}>
      <ambientLight />
      <ScrollControls>
        <Suspense fallback={null}>
          <Rig imagesUrl={imagesUrl} />
        </Suspense>
      </ScrollControls>
    </Canvas>
  );
};

type RigProps = {
  imagesUrl: string[];
};

const Rig: React.FC<RigProps> = ({ imagesUrl }) => {
  const { viewport } = useThree();

  return (
    <group
      position={[-viewport.width / 2, viewport.height / 2, 0]}
      // rotation={[Math.PI / 1.8, 0, 0]}
    >
      {imagesUrl.map((url, index) => {
        return (
          <Card
            // TODO: remove index from key
            key={url + index}
            url={url}
            index={index}
            numberOfImages={imagesUrl.length}
          />
        );
      })}
    </group>
  );
};

type CardProps = {
  url: string;
  index: number;
  numberOfImages: number;
};

const Card: React.FC<CardProps> = ({ url, index, numberOfImages }) => {
  // Hooks
  const ref = useRef<THREE.Mesh>(null);
  const cardShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollData = useScroll();
  const { viewport } = useThree();

  // TODO: remove realAngle state
  const [realAngle, setRealAngle] = useState(0);
  const [isSelected, setIsSelected] = useState(false);

  const [image] = useLoader(THREE.TextureLoader, [url]);

  // Data
  const angle = (index / numberOfImages) * Math.PI * 2;
  const shorterSide =
    viewport.height < viewport.width ? viewport.height : viewport.width;
  const radius = shorterSide;
  const cardScale = shorterSide * 0.48;
  const starCardNumber = 9;

  useFrame(({ clock }, delta) => {
    if (ref.current) {
      // Calculate the scroll angle based on the scroll offset
      // x : scrollOffset = Math.PI * 2 : 1
      const scrollAngle = scrollData.offset * Math.PI * 2;
      setRealAngle(scrollAngle + angle);

      // Calculate the new position of the card based on the scroll angle and the adjusted angle
      ref.current.position.x = Math.cos(scrollAngle + angle) * radius;
      ref.current.position.y = Math.sin(scrollAngle + angle) * radius;
      ref.current.position.z = Math.sin(scrollAngle + angle) * radius * -1.2;

      // The last card is the "selected one" (the first below the horizon line is the more visible)
      // The Horizon line is at Math.PI * 2 or 0
      // So we need to check if the real angle is between the selected card and the next one
      const angleIncrement = (Math.PI * 2) / numberOfImages;
      // TODO: Maybe calculate which one to highlight based on the number of images

      const starCardAngle = angleIncrement * starCardNumber;
      const isStarCard =
        realAngle % (Math.PI * 2) >= starCardAngle - angleIncrement / 2 &&
        realAngle % (Math.PI * 2) <= starCardAngle + angleIncrement / 2;

      if (isStarCard) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    }

    if (cardShaderMaterialRef.current) {
      cardShaderMaterialRef.current.uniforms.uTime.value += delta;
      // cardShaderMaterialRef.current.uniforms.uTime.value += delta;
    }
  });

  // return (
  //   // eslint-disable-next-line jsx-a11y/alt-text
  //   <Image
  //     ref={ref}
  //     url={url}
  //     transparent
  //     side={THREE.DoubleSide}
  //     scale={[cardScale, cardScale * 1.33]}
  //     rotation={[-0.05, 0, 0]}
  //   >
  //     {/* <Text fontSize={0.1} color="#000" position={[0, 0, 2]}>
  //       {index} {isSelected ? "I'M THE STAR" : "BOO"} {realAngle.toFixed(2)}
  //     </Text> */}
  //   </Image>
  // );

  return (
    <mesh ref={ref} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[cardScale, cardScale * 1.33, 16, 16]} />
      <meshStandardMaterial
      // map={new THREE.TextureLoader().load(url)}
      />
      <cardShaderMaterial
        // wireframe
        uColor="violet"
        uTime={4}
        uTexture={image}
        ref={cardShaderMaterialRef}
        // wireframe
      />
    </mesh>
  );
};

const CardShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(0xffff00),
    uTexture: new THREE.Texture(),
  },
  // Vertex shader
  /* glsl */ `
      precision mediump float;
      uniform float uTime;
      // varying is used to pass data from the vertex shader to the fragment shader
      varying vec2 vUv;

      void main() {
        // vUv is a varying vec2 that contains the UV coordinates of the vertex
        vUv = uv;

        vec3 pos = position;
    
        // float bendAmount = 30.0; // Adjust this to control the amount of bending
        // float bendRadius = 0.5; // Adjust this to control the radius of the bending
        // float theta = pos.x / bendRadius;
        // pos.x = bendRadius * sin(theta);
        // pos.z = bendRadius * (1.0 - cos(theta)) * bendAmount;

        float bendAmount = 10.0; // Adjust this to control the amount of bending 
        float bendRadius = 1.5; // Adjust this to control the radius of the bending
        float theta = pos.x / bendRadius;
        pos.z = radians(360.0) * (1.0 - cos(theta)) * bendAmount;

      // pos.x = radians(360.0) * sin(theta);
      


        

        // Wave effect on the z axis based on the y position
        // float waveFreq = 5.0;
        // float waveAmp = 0.1;
        // pos.z += sin(pos.x * waveFreq + uTime) * waveAmp;
        // pos.z += sin(pos.y * waveFreq + uTime) * waveAmp;
    
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
  // Fragment shader
  /* glsl */ `
      precision mediump float;
      uniform vec3 uColor;
      uniform float uTime;
      uniform sampler2D uTexture;
      // access the UV coordinates passed from the vertex shader
      varying vec2 vUv;

      void main() {
        vec3 texture = texture2D(uTexture, vUv).rgb;
        // gl_FragColor is a vec4 that contains the color of the pixel
        // gl_FragColor = vec4(sin(vUv.x + uTime) * uColor, 1.0);
        gl_FragColor = vec4(texture, 1.0);
      }
    `,
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cardShaderMaterial: {
        uColor: string;
        uTime: number;
        uTexture: THREE.Texture;
      } & ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

extend({ CardShaderMaterial });

export default HomeScene;
