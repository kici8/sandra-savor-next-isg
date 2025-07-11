precision mediump float;

varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;

    // float distanceFromCenter = abs(modelMatrix * vec4(pos, 1.0)).x;
    // pos.y *= 1.0 + 0.3 * pow(distanceFromCenter, 2.0);

    float radius = 0.8; // Adjust for more/less curvature
    float angle = pos.x / 2.0; // Adjust denominator for width/curvature

    float newX = sin(angle) * radius;
    float newZ = radius - cos(angle) * radius;

    pos.x = newX;
    pos.z += newZ;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}