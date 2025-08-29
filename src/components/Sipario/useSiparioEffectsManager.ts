import { useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

export type MeshEffectContext = {
  time: number;
  cardWidth: number;
  cardHeight: number;
  mouse: { x: number; y: number };
  rect?: DOMRect | null;
};

type MeshEffectParams = {
  orig: Float32Array;
  bufferIndex: number;
  context: MeshEffectContext;
  strength: number;
};

export type MeshEffect = (props: MeshEffectParams) => [number, number, number];

export type MeshEffectWrapper = {
  effect: MeshEffect;
  strength: number;
  name: string;
};

type ApplyEffectsProps = MeshEffectParams & {
  x: number;
  y: number;
  z: number;
};

type AddEffectProps = {
  name: string;
  effect: MeshEffect;
  strength?: number;
};

export type UpdateEffectProps = {
  name: string;
  strength: number;
  duration?: number;
  ease?: gsap.EaseString | gsap.EaseFunction;
};

export type SiparioImageRegistry = Map<
  string,
  {
    meshRef: React.RefObject<THREE.Mesh>;
    effectsRef: React.RefObject<MeshEffectWrapper[]>;
    transformationContainerRef: React.RefObject<THREE.Group>;
  }
>;

type RegisterMeshProps = {
  siparioImageId: string;
  meshRef: React.RefObject<THREE.Mesh>;
  effectsRef: React.RefObject<MeshEffectWrapper[]>;
  transformationContainerRef: React.RefObject<THREE.Group>;
};

export function useSiparioEffectsManager() {
  // Registry: id -> { meshRef, effectsRef, transformationContainerRef }
  const siparioImageRegistry = useRef<SiparioImageRegistry>(new Map());

  // Register a mesh and its refs
  function registerMesh({
    siparioImageId,
    meshRef,
    effectsRef,
    transformationContainerRef,
  }: RegisterMeshProps) {
    siparioImageRegistry.current.set(siparioImageId, {
      meshRef,
      effectsRef,
      transformationContainerRef,
    });
  }

  function unregisterMesh(siparioImageId: string) {
    siparioImageRegistry.current.delete(siparioImageId);
  }

  // Utility to get refs for a mesh by id
  function getMeshEntry(siparioImageId: string) {
    return siparioImageRegistry.current.get(siparioImageId);
  }

  // Effect management for a single mesh (by id)
  function addEffect(
    siparioImageId: string,
    { name, effect, strength = 1 }: AddEffectProps,
  ) {
    const entry = siparioImageRegistry.current.get(siparioImageId);
    if (!entry) return;
    entry.effectsRef.current.push({ name, effect, strength });
  }

  function updateEffect(
    siparioImageId: string,
    { name, strength, duration = 1, ease = "power2.out" }: UpdateEffectProps,
  ) {
    const entry = siparioImageRegistry.current.get(siparioImageId);
    if (!entry) return;
    const target = entry.effectsRef.current.find((e) => e.name === name);
    if (!target) return;
    gsap.to(target, {
      strength,
      duration,
      ease,
    });
  }

  function applyEffects(
    siparioImageId: string,
    { orig, bufferIndex, context, x, y, z }: ApplyEffectsProps,
  ) {
    const entry = siparioImageRegistry.current.get(siparioImageId);
    if (!entry) return [x, y, z];
    for (const { effect, strength } of entry.effectsRef.current) {
      if (strength <= 0.001) continue;
      const [dx, dy, dz] = effect({
        orig,
        bufferIndex,
        context,
        strength,
      });
      x += dx * strength;
      y += dy * strength;
      z += dz * strength;
    }
    return [x, y, z];
  }

  return {
    meshRegistry: siparioImageRegistry,
    registerMesh,
    unregisterMesh,
    getMeshEntry,
    addEffect,
    updateEffect,
    applyEffects,
  };
}
