import { MeshEffect } from "./EffectsManager";

export const inflateOnMouseEffect = (
  minInflate: number,
  maxInflate: number,
  influenceFactor = 1.2,
): MeshEffect => {
  return ({ bufferIndex, context, orig }) => {
    const { cardWidth, cardHeight, mouse, rect } = context;

    const x = orig[bufferIndex];
    const y = orig[bufferIndex + 1];
    // const z = orig[bufferIndex + 2];

    if (!rect) return [0, 0, 0];

    const mouseCardX = ((mouse.x - rect.left) / rect.width - 0.5) * cardWidth;
    const mouseCardY = ((mouse.y - rect.top) / rect.height - 0.5) * cardHeight;

    const dist = Math.sqrt((x - mouseCardX) ** 2 + (-y - mouseCardY) ** 2);
    const influenceRadius = cardWidth * influenceFactor;
    const normalizedDist = Math.min(dist / influenceRadius, 1);

    const inflate =
      minInflate + (1 - normalizedDist) * (maxInflate - minInflate);

    return [0, 0, inflate];
  };
};
