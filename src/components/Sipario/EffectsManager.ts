"use client";
import gsap from "gsap";

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

type ToggleEffectProps = {
  name: string;
  on: boolean;
  duration?: number;
};

export class SiparioEffectsManager {
  private effects: MeshEffectWrapper[] = [];

  addEffect({ name, effect, strength = 1 }: AddEffectProps) {
    this.effects.push({ name, effect, strength });
  }

  toggleEffect({ name, on, duration = 1 }: ToggleEffectProps) {
    const target = this.effects.find((e) => e.name === name);
    if (!target) return;
    gsap.to(target, {
      strength: on ? 1 : 0,
      duration,
      ease: "power2.out",
    });
  }

  applyEffects({ orig, bufferIndex, context, x, y, z }: ApplyEffectsProps) {
    for (const { effect, strength } of this.effects) {
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
}
