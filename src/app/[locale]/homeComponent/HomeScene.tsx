"use client";

import {
  Scroll,
  ScrollControls,
  shaderMaterial,
  Text,
  useScroll,
} from "@react-three/drei";
import {
  Canvas,
  ReactThreeFiber,
  extend,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";
import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";

type HomeSceneProps = {
  imagesUrl: string[];
};

const HomeScene: React.FC<HomeSceneProps> = ({ imagesUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 10, rotation: [0, 0, 0] }}>
      <ambientLight />
      <Rig imagesUrl={imagesUrl} />
    </Canvas>
  );
};

type RigProps = {
  imagesUrl: string[];
};

const Rig: React.FC<RigProps> = ({ imagesUrl }) => {
  const { viewport } = useThree();
  // Data
  const shorterSide =
    viewport.height < viewport.width ? viewport.height : viewport.width;
  const cardWidth = shorterSide * 0.48;
  const cardHeight = cardWidth * 1.33;
  // const cardHeight = viewport.height;
  const gap = 0.05;
  const heightWithGap = cardHeight + gap;

  // Starts from the center of the screen
  // pages={
  //   (viewport.height - heightWithGap + imagesUrl.length * heightWithGap) /
  //   viewport.height
  // }
  // Starts from the top of the screen
  // pages={(heightWithGap * imagesUrl.length) / viewport.height}
  const pages =
    (viewport.height - heightWithGap + imagesUrl.length * heightWithGap) /
    viewport.height;

  return (
    <Suspense fallback={null}>
      <Text scale={0.05} position={[0, 0.5, 0]}>
        wh: {Math.round(viewport.height * 10000) / 10000} center:{" "}
        {Math.round((viewport.height / 2) * 10000) / 10000}
      </Text>
      <ScrollControls
        damping={0.1}
        // infinite
        pages={pages}
      >
        <Scroll>
          {imagesUrl.map((url, index) => {
            return (
              <Card
                // TODO: remove index from key
                key={url + index}
                url={url}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                heightWithGap={heightWithGap}
                pages={pages}
                // start from the center of the screen
                positionY={-index * heightWithGap}
                // start from the top of the screen
                // position={[
                //   0,
                //   -index * heightWithGap + (viewport.height - cardHeight) / 2,
                //   0,
                // ]}
                index={index}
              />
            );
          })}
        </Scroll>
      </ScrollControls>
    </Suspense>
  );
};

type CardProps = {
  url: string;
  cardWidth: number;
  cardHeight: number;
  heightWithGap: number;
  positionY: number;
  pages: number;
  index: number;
};

const Card: React.FC<CardProps> = ({
  url,
  cardWidth,
  cardHeight,
  heightWithGap,
  positionY,
  pages,
  index,
}) => {
  // Hooks
  const { viewport } = useThree();
  const ref = useRef<THREE.Mesh>(null);
  const cardShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollData = useScroll();

  const [testScrolling, setTestScrolling] = useState(0);

  useFrame(() => {
    // scrollData.offset is the current scroll position that goes from 0 to 1
    // the viewport height is expressed in three units, in this case is 1.74977327051848 (don't know why)
    // at the end of the scroll I have these values:
    // pages 7.00277617681213
    // the last (of 10) is at -10.503...
    // so we have to consider the position of the card is based on his center
    // the pages doesn't represent the total value of the scroll,
    // but the total value of the scroll is pages * viewport.height

    // so with that in mind, we can calculate when a card is the most near to the center of the screen
    // or if it's completely visible
    // or even better,
    // the proximity to the center of the screen expressed in percentage of the height of the card
    // that can also be a negative value,
    // for example in the center of the screen is 0,
    // if is a card height above the center is -1,
    // if is two card below the center is 2,

    // TODO: this is not working as expected but is not so far from the solution
    const centerY = viewport.height / 2; // Center of the screen
    const cardPositionY = scrollData.offset;
    // const cardPositionY =
    //   -index * heightWithGap + scrollData.offset * pages * viewport.height;
    // const distanceFromCenter = (cardPositionY - centerY) / heightWithGap;

    setTestScrolling(cardPositionY);
  });

  const [image] = useLoader(THREE.TextureLoader, [url]);

  return (
    <mesh ref={ref} position={[0, positionY, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[cardWidth, cardHeight, 16, 16]} />
      <cardShaderMaterial
        uFirstRow={Math.floor(Math.random() * 10) / 10}
        uTexture={image}
        ref={cardShaderMaterialRef}
        // wireframe
      />

      <Text scale={0.1}> {Math.round(testScrolling * 10000) / 10000}</Text>
      <Text scale={0.05} position={[0, -0.5, 0]}>
        position: {Math.round(positionY * 10000) / 10000}
      </Text>
      <Text scale={0.05} position={[0, -0.4, 0]}>
        globalScroll: {Math.floor(Math.random() * 10) / 10}
      </Text>
    </mesh>
  );
};

const CardShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uFirstRow: 0,
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

export default HomeScene;
