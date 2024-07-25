// these are allready defined in the shader program
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;
// attribute vec3 position;

precision mediump float;
// varying is used to pass data from the vertex shader to the fragment shader
varying vec2 vUv;

void main() {
    // vUv is a varying vec2 that contains the UV coordinates of the vertex
    vUv = uv;
    vec3 pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}