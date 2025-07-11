precision mediump float;

uniform sampler2D uTexture;
uniform int uDirection;
uniform float uSpeed;

// access the UV coordinates passed from the vertex shader
varying vec2 vUv;

void main() {
    vec2 uv = vUv; // Iniziamo con le coordinate UV originali
    vec4 baseState = texture2D(uTexture, uv);

    // TODO 

    gl_FragColor = vec4(baseState.rgb, 1.0);
}
