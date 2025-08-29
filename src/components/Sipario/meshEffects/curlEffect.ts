import * as THREE from "three";
import { MeshEffect } from "../useSiparioEffectsManager";

// axesAngleInDeg: the angle of the axis around which the curl happens, in degrees from 0 to 90
export const curlEffect = (axesAngleInDeg: number): MeshEffect => {
  // OK rewrite this
  // I want to pass the angle (the axis of the curl)
  // then when the strength is 1 it curls fully around that axis while when 0 it's flat
  // so I need to calculate the radius of the cylinder based on the angle and the width

  return ({ orig, bufferIndex, strength, context }) => {
    // If strength is 0 or very low, return no deformation
    if (strength <= 0.001) return [0, 0, 0];

    const { cardWidth, cardHeight } = context;
    const axesAngleInRad = THREE.MathUtils.degToRad(axesAngleInDeg);

    // this is the perimeter of the cylinder that would wrap the card diagonally
    const cylinderPerimeter =
      2 *
      Math.abs(
        cardWidth * Math.sin(axesAngleInRad) +
          cardHeight * Math.cos(axesAngleInRad),
      );

    // This is the radius of the cylinder when the card is fully curled (strength = 1)
    const minRadius = cylinderPerimeter / (2 * Math.PI);

    // Original vertex position
    const x = orig[bufferIndex];
    const y = orig[bufferIndex + 1];
    const z = orig[bufferIndex + 2];

    // Calculate the current radius based on strength
    const radius = minRadius / strength; // Avoid

    // FIXME: at strength 1 is not full curl (a closed cylinder). Need to adjust something down here
    // Rotate the point to align with the curl axis
    const xr = x * Math.cos(axesAngleInRad) - y * Math.sin(axesAngleInRad);
    const yr = x * Math.sin(axesAngleInRad) + y * Math.cos(axesAngleInRad);

    const xNorm = xr / (cardWidth / 2);
    const theta = (xNorm * (cardWidth / 2)) / radius;

    const newXr = radius * Math.sin(theta);
    const newZ = -radius * (1.0 - Math.cos(theta));

    // Rotate back to original orientation
    const newX =
      newXr * Math.cos(-axesAngleInRad) - yr * Math.sin(-axesAngleInRad);
    const newY =
      newXr * Math.sin(-axesAngleInRad) + yr * Math.cos(-axesAngleInRad);
    const dx = newX - x;
    const dy = newY - y;
    const dz = newZ - z;

    return [dx, dy, dz];
  };
};
