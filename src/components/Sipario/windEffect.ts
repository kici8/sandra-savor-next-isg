import { MeshEffect } from "./EffectsManager";

export const windEffect = (baseStrength: number): MeshEffect => {
  return ({ bufferIndex, context, orig }) => {
    const { time } = context;
    const x = orig[bufferIndex];
    const y = orig[bufferIndex + 1];
    // const z = orig[bufferIndex + 2];

    const wind =
      Math.sin(time * 0.4 + x * 0.6 + y * 0.4) * baseStrength +
      Math.cos(time * 0.02 + y * 0.02) * baseStrength;

    return [0, 0, wind];
  };
};
