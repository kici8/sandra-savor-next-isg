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
  extend,
  ReactThreeFiber,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import { transform } from "framer-motion";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./fragment.frag";
import vertexShader from "./vertex.vert";

type HomeSceneProps = {
  imagesUrl: string[];
};

const HomeScene: React.FC<HomeSceneProps> = ({ imagesUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 10 }}>
      <ambientLight />
      <Suspense fallback={null}>
        <ScrollContainer imagesUrl={imagesUrl} />
      </Suspense>
    </Canvas>
  );
};

type ScrollContainerProps = {
  imagesUrl: string[];
};

const ScrollContainer: React.FC<ScrollContainerProps> = ({ imagesUrl }) => {
  const { viewport } = useThree();

  const cardHeightInViewportPercentage = 0.64;
  const gap = 0.05;
  const cardHeight = viewport.height * cardHeightInViewportPercentage - gap;
  const cardWidth = (cardHeight / 4) * 3;
  const cardHeightWithGap = cardHeight + gap;
  const pages = (imagesUrl.length * cardHeightWithGap) / viewport.height + 1;

  const duplicatedImages = [...imagesUrl, ...imagesUrl];

  return (
    <>
      <Text scale={0.05} position={[0, 0.5, 0]}>
        wh: {Math.round(viewport.height * 10000) / 10000} center:{" "}
        {Math.round((viewport.height / 2) * 10000) / 10000}
      </Text>
      <ScrollControls
        // damping={0.4}
        // maxSpeed={1.2}
        distance={1}
        infinite
        pages={pages}
      >
        <Scroll>
          {/* Duplicated card for infinite scroll */}
          <Card
            url={imagesUrl[imagesUrl.length - 1]}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            heightWithGap={cardHeightWithGap}
            pages={pages}
            positionY={cardHeightWithGap}
            index={imagesUrl.length}
          />
          {/* Card map */}
          {duplicatedImages.map((url, index) => {
            return (
              <Card
                key={url}
                url={url}
                cardWidth={cardWidth}
                cardHeight={cardHeight}
                heightWithGap={cardHeightWithGap}
                pages={pages}
                positionY={-index * cardHeightWithGap}
                index={index}
              />
            );
          })}
        </Scroll>
      </ScrollControls>
    </>
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
  const ref = useRef<THREE.Mesh>(null);
  const cardShaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const scrollData = useScroll();

  const cardScrollValueRef = useRef(0.1);
  const scrollTransformer = transform([0, 1], [0.1, 0.99]);

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

    // setTestScroll(scrollTransformer(scrollData.offset));
    cardScrollValueRef.current = scrollTransformer(scrollData.offset);
    if (cardShaderMaterialRef.current) {
      cardShaderMaterialRef.current.uniforms.uFirstRow.value =
        cardScrollValueRef.current;
    }

    // const cardPositionY =
    //   -index * heightWithGap + scrollData.offset * pages * viewport.height;
    // const distanceFromCenter = (cardPositionY - centerY) / heightWithGap;
  });

  const [image] = useLoader(THREE.TextureLoader, [url]);

  return (
    <mesh ref={ref} position={[0, positionY, 0]} rotation={[0, 0, 0]}>
      <planeGeometry args={[cardWidth, cardHeight, 9, 12]} />
      <cardShaderMaterial
        uFirstRow={cardScrollValueRef.current}
        uTexture={image}
        ref={cardShaderMaterialRef}
        // wireframe
      />

      <Text scale={0.1}>{cardScrollValueRef.current}</Text>
      <Text scale={0.05} position={[0, -0.5, 0]}>
        position: {Math.round(positionY * 10000) / 10000}
      </Text>
    </mesh>
  );
};

const CardShaderMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uFirstRow: 0.1,
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
