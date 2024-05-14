// these are allready defined in the shader program
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;

// attribute vec3 position;

precision mediump float;
uniform float uTime;
uniform float scrollDelta;
      // varying is used to pass data from the vertex shader to the fragment shader
varying vec2 vUv;

void main() {
        // vUv is a varying vec2 that contains the UV coordinates of the vertex
    vUv = uv;

    vec3 pos = position;
    float width = length(pos.xy);
         // I vertici da modificare sono pos.x e pos.z

        // pos.xy = vec2(cos(uTime) * width, sin(uTime) * width);

       // Questo è interessante per fare un effetto legato al delta dello scroll
        // pos.xz = vec2(pos.x, pos.y + sin(uTime) * width);
    pos.xz = vec2(pos.x, pos.y + sin(scrollDelta * 2500.5) * width);

        // float bendAmount = 30.0; // Adjust this to control the amount of bending
        // float bendRadius = 0.5; // Adjust this to control the radius of the bending
        // float theta = pos.x / bendRadius;
        // pos.x = bendRadius * sin(theta);
        // pos.z = bendRadius * (1.0 - cos(theta)) * bendAmount;

        // float bendAmount = 10.0; // Adjust this to control the amount of bending 
        // float bendRadius = 1.5; // Adjust this to control the radius of the bending
        // float theta = pos.x / bendRadius;
        // pos.z = radians(360.0) * (1.0 - cos(theta)) * bendAmount;

      // pos.x = radians(360.0) * sin(theta);

        // Wave effect on the z axis based on the y position
        // float waveFreq = 5.0;
        // float waveAmp = 0.1;
        // pos.z += sin(pos.x * waveFreq + uTime) * waveAmp;
        // pos.z += sin(pos.y * waveFreq + uTime) * waveAmp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}