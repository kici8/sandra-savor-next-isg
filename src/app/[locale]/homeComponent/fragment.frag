precision mediump float;

uniform sampler2D uTexture;
uniform int uDirection;
uniform float uSpeed;

// access the UV coordinates passed from the vertex shader
varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    if(uDirection == 1) {
        if(vUv.y < uSpeed) {
            uv = vec2(vUv.x, 0.0);
        }
    } 

    // if(uDirection == -1) {
    //     if(vUv.y > uSpeed) {
    //         uv = vec2(vUv.x, 1);
    //     }
    // }

    vec4 baseState = texture2D(uTexture, uv);

    gl_FragColor = vec4(baseState.rgb, 1.0);
}
