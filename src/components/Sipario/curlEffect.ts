import { MeshEffect } from "./EffectsManager";

function curlPlane(
  x: number,
  start: number,
  radius: number,
  deformationStrength: number,
  isFlipped: boolean,
): [number, number] {
  const v1 = isFlipped
    ? start * deformationStrength
    : start - start * deformationStrength;
  const n1 = start > 0.0 ? 1.0 : -1.0;

  const t1 = 0.01; // soglia per evitare divisioni per zero

  const e1 = isFlipped ? n1 * v1 : n1 * x;
  const e2 = isFlipped ? n1 * x : n1 * v1;

  if (radius <= t1) {
    return [x, 0.0];
  }

  if (e1 <= e2) {
    return [x, 0.0];
  }

  const r2 = Math.abs(start) / radius;
  const hp = Math.PI / 2;

  const newX = v1 / r2 + Math.cos(x / r2 - hp - v1 / r2);
  const newY = -Math.sin(x / r2 + hp - v1 / r2) + 1.0;

  return [newX * r2, newY * r2];
}

type curlEffectParams = {
  startRef: React.RefObject<number>;
  radiusRef: React.RefObject<number>;
  deformationStrengthRef: React.RefObject<number>;
  isFlippedRef: React.RefObject<boolean>;
};

export const curlEffect = ({
  startRef,
  radiusRef,
  deformationStrengthRef,
  isFlippedRef,
}: curlEffectParams): MeshEffect => {
  return ({ orig, bufferIndex }) => {
    const x = orig[bufferIndex];
    const y = orig[bufferIndex + 1];
    const z = orig[bufferIndex + 2];

    const s = startRef.current;
    const r = radiusRef.current;
    const k = deformationStrengthRef.current;
    const flip = isFlippedRef.current;

    // TODO: curva solo lungo X (adattare per anche Y)
    const [cx, cy] = curlPlane(x, s, r, k, flip);

    return [cx, y + cy, z];
  };
};
