precision mediump float;

uniform vec3 uColor;
uniform float uTime;
uniform sampler2D uTexture;
      // access the UV coordinates passed from the vertex shader
varying vec2 vUv;

void main() {
    vec3 texture = texture2D(uTexture, vUv).rgb;
        // gl_FragColor is a vec4 that contains the color of the pixel
        // gl_FragColor = vec4(sin(vUv.x + uTime) * uColor, 1.0);
    gl_FragColor = vec4(texture, 1.0);
}