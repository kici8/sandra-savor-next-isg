precision mediump float;

uniform sampler2D uTexture;
uniform float uFirtRow;

// access the UV coordinates passed from the vertex shader
varying vec2 vUv;

void main() {

    vec2 uv;
    if(vUv.y > uFirtRow) {
        uv = vec2(vUv.x, 1.0);
    } else {
        uv = vec2(vUv.x, vUv.y);
    }

    vec4 baseState = texture2D(uTexture, uv);

    gl_FragColor = vec4(baseState.rgb, 1.0);
}
