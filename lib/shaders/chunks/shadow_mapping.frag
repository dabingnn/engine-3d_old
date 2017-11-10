uniform sampler2D shadowMap;
varying vec4 pos_lightspace;
// unused version
// float restDepth(vec4 RGBA) {
//   const float rMask = 1.0;
//   const float gMask = 1.0 / 255.0;
//   const float bMask = 1.0 / (255.0 * 255.0);
//   const float aMask = 1.0 / (255.0 * 255.0 * 255.0);
//   float depth = dot(RGBA, vec4(rMask, gMask, bMask, aMask));
//   return depth;
// }

// a fast version
float unpackRGBAToDepth(vec4 color) {
  return dot(color, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0));
}

float calculateShadow(vec4 posLS) {
  vec3 projCoords = posLS.xyz / posLS.w;
  projCoords = projCoords * 0.5 + 0.5;
  float closestDepth = unpackRGBAToDepth(texture2D(shadowMap, projCoords.xy));
  float currentDepth = projCoords.z;
  float shadow = (currentDepth > closestDepth + 0.001) ? 1.0 : 0.0;
  return shadow;
}