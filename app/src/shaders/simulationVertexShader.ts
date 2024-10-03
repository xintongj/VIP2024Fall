const vertexShader = `
uniform float uTime;

varying vec2 vUv;

void main() {
  vUv = uv;

  // Basic time-based displacement
  vec3 displacedPosition = position + vec3(sin(uTime + position.x), cos(uTime + position.y), sin(uTime + position.z)) * 0.1;

  vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
}

`;

export default vertexShader;
