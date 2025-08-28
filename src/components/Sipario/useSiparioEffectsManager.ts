/**
 * Manages mesh effects for the Sipario component, allowing dynamic addition, update, and application of effects.
 *
 * @returns An object containing methods to add, update, and apply mesh effects, as well as the current list of effects.
 *
 * @property addEffect - Adds a new mesh effect to the manager.
 * @property updateEffect - Updates the strength of an existing effect, optionally animating the change.
 * @property applyEffects - Applies all active effects to the given mesh coordinates.
 * @property effects - The current array of effect wrappers.
 *
 * @example
 * const manager = useSiparioEffectsManager();
 * manager.addEffect({ name: "wave", effect: waveEffect, strength: 0.5 });
 * manager.updateEffect({ name: "wave", strength: 1, duration: 2 });
 * const [x, y, z] = manager.applyEffects({ ...meshParams, x: 0, y: 0, z: 0 });
 */
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

type MeshEffectWrapper = {
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

type UpdateEffectProps = {
  name: string;
  strength: number;
  duration?: number;
  ease?: gsap.EaseString | gsap.EaseFunction;
};

export function useSiparioEffectsManager() {
  const effectsRef = useRef<MeshEffectWrapper[]>([]);
  const groupTransformRef = useRef<THREE.Group>(null);

  function addEffect({ name, effect, strength = 1 }: AddEffectProps) {
    effectsRef.current.push({ name, effect, strength });
  }

  function updateEffect({
    name,
    strength,
    duration = 1,
    ease = "power2.out",
  }: UpdateEffectProps) {
    const target = effectsRef.current.find((e) => e.name === name);
    if (!target) return;
    gsap.to(target, {
      strength,
      duration,
      ease,
    });
  }

  function applyEffects({
    orig,
    bufferIndex,
    context,
    x,
    y,
    z,
  }: ApplyEffectsProps) {
    for (const { effect, strength } of effectsRef.current) {
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
    addEffect,
    updateEffect,
    applyEffects,
    effects: effectsRef.current,
    groupTransformRef,
  };
}
