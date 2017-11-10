

// unused version
// vec4 convRGBA(float depth) {
//   float r = depth;
//   float g = fract(r * 255.0);
//   float b = fract(g * 255.0);
//   float a = fract(b * 255.0);
//   float coef = 1.0 / 255.0;
//   r -= g * coef;
//   g -= b * coef;
//   b -= a * coef;
//   return vec4(r, g, b, a);
// }

// a fast version
vec4 packDepthToRGBA(float depth) {
  vec4 ret = vec4(1.0, 255.0, 65025.0, 160581375.0) * depth;
  ret = fract(ret);
  ret -= ret.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);
  return ret;
}
void main() {
  gl_FragColor = packDepthToRGBA(gl_FragCoord.z);
}