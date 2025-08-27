import { useFrame, useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  // Passiamo le UV e le normali al fragment shader
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  // Posizione finale della mesh
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec3 uSolidColor;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  if (gl_FrontFacing) {
    gl_FragColor = texture2D(uTexture, vUv);
  } else {
    gl_FragColor = vec4(uSolidColor, 1.0);
  }
}
`;

type DoubleSideImageProps = {
  imageUrl: string;
  solidColor: string;
} & React.JSX.IntrinsicElements["mesh"];

export function DoubleSideImage({
  imageUrl,
  solidColor,
  children,
  ...props
}: DoubleSideImageProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  const uniforms = useRef({
    uTime: { value: 0 },
    uTexture: { value: texture },
    uSolidColor: { value: new THREE.Color(solidColor) },
  });

  useFrame(({ clock }) => {
    uniforms.current.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} {...props}>
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
      {children}
    </mesh>
  );
}
