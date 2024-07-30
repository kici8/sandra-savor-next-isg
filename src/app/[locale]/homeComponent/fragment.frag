precision mediump float;

uniform sampler2D uTexture;
uniform float uFirstRow;

// access the UV coordinates passed from the vertex shader
varying vec2 vUv;

void main() {

    vec2 uv = vUv;
    // if(vUv.y > uFirstRow) {
    //     uv = vec2(vUv.x, uFirstRow);
    // } else {
    //     uv = vec2(vUv.x, vUv.y);
    // }

    vec4 baseState = texture2D(uTexture, uv);

    gl_FragColor = vec4(baseState.rgb, 1.0);
}
