// // customShaders.js

// import { patchShaders } from 'gl-noise/build/glNoise.m';

// export const shaders = {
//   vertex: /* glsl */ `
//     uniform float uTime;
//     varying float vVisibility;
//     varying vec3 vViewNormal;

//     void main() {
//       vec3 n = gln_curl(position + uTime * 0.05);

//       vec3 _viewNormal = normalMatrix * normal;
//       vViewNormal = _viewNormal;
//       vec4 _mvPosition = modelViewMatrix * vec4(position, 1.);

//       float visibility = step(-0.1, dot(-normalize(_mvPosition.xyz), normalize(_viewNormal)));
//       vVisibility = visibility;

//       csm_Position = position + (normal * n * 0.5);
//       csm_PointSize += ((1. - visibility) * 0.05);
//     }
//   `,
//   fragment: /* glsl */ `
//     varying float vVisibility;
//     varying vec3 vViewNormal;

//     void main() {
//       vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
//       vec2 cUV = 2. * uv - 1.;
//       float a = .15 / length(cUV);
//       float alpha = 1.;
//       if (a < 0.15) alpha = 0.;

//       csm_DiffuseColor = vec4(vViewNormal, (vVisibility + 0.01) * alpha);
//     }
//   `,
// };

// export const patchedShaders = {
//   vertex: patchShaders(shaders.vertex),
//   fragment: patchShaders(shaders.fragment),
// };
