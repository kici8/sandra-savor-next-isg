precision mediump float;

varying vec2 vUv;
uniform int uDirection;
uniform float uSpeed;
uniform float uRectangleWidth;

void main() {
    vUv = uv;
    vec3 pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}

// void main() {
//     vUv = uv;

//     float uCurlAmount = 0.2; // A value from 0.0 to 1.0 controlling the curl (0 = flat, 1 = full curl)
//     float uCurlRadius = 0.2; // The radius of the cylinder around which to curl

//     vec3 newPosition = position;

//     // Normalize x from -0.5 to 0.5 (assuming a plane centered at origin)
//     // Adjust based on your actual plane dimensions if not centered or scaled.
//     // Let's assume the plane has a width of `uRectangleWidth` and its x goes from -uRectangleWidth/2 to uRectangleWidth/2
//     float normalizedX = (position.x + uRectangleWidth / 2.0) / uRectangleWidth;

//     // // Define the start of the curl (e.g., the right 20% of the rectangle)
//     float curlStartNormalizedX = 0.8; // Adjust as needed
//     float curlRangeNormalizedX = 1.0 - curlStartNormalizedX;

//     // // Calculate how far into the curl zone this vertex is (0.0 to 1.0)
//     // float curlProgress = max(0.0, (normalizedX - curlStartNormalizedX) / curlRangeNormalizedX);

//     // // Apply the curl effect based on uCurlAmount
//     // if(curlProgress > 0.0) {
//     //     // Only curl if the curl amount is greater than 0
//     //     float currentCurlAngle = uCurlAmount * (PI / 2.0); // Curl up to 90 degrees (quarter circle)

//     //     // Map the curlProgress to an angle within the currentCurlAngle
//     //     float angle = curlProgress * currentCurlAngle;

//     //     // Calculate the new X and Z coordinates based on the circle
//     //     float curvedX = uCurlRadius * sin(angle);
//     //     float curvedZ = uCurlRadius * (1.0 - cos(angle)); // Shifted so it starts at Z=0

//     //     // Adjust the original position
//     //     // We want the part of the rectangle that is flat to transition smoothly
//     //     // to the curved part.
//     //     // The point where the curl begins needs to be the anchor.
//     //     float flatX = (curlStartNormalizedX - 0.5) * uRectangleWidth; // The absolute X where the curl starts

//     //     // newPosition.x will be the flatX plus the curvedX displacement
//     //     newPosition.x = flatX + (uRectangleWidth * curlRangeNormalizedX - curvedX); // Adjust for the right edge to be the "tube" edge
//     //     newPosition.z += curvedZ;

//     //     // Smoothly blend between flat and curved based on curlProgress
//     //     // This makes the transition smoother, but the core bending is done by curvedX and curvedZ
//     //     // For a more physically accurate "paper bend", you might need more complex math
//     //     // or a more finely subdivided mesh.
//     // }

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
// }