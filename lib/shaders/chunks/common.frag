// common module

// constant value
#define PI 3.14159265359
#define PI2 6.28318530718
#define EPSILON 1e-6
#define LOG2 1.442695

// common function
#define saturate(a) clamp( a, 0.0, 1.0 )

// gamma-correction
// approximate version from http://chilliant.blogspot.com.au/2012/08/srgb-approximations-for-hlsl.html?m=1
// also used by Unity builtin shaders(2017.2.0f3)
vec3 gammaToLinearSpace(vec3 sRGB) { // TODO: use half maybe better.
  return sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);
}
vec3 linearToGammaSpace(vec3 lRGB) { // TODO: use half maybe better.
  lRGB = max(lRGB, vec3(0.0));
  return max(1.055 * pow(lRGB, vec3(0.416666667)) - vec3(0.055), vec3(0.0));
}
// exact version
float gammaToLinearSpaceExact(float val) {
  if (val <= 0.04045) {
    return val / 12.92;
  } else if (val < 1.0) {
    return pow((val + 0.055) / 1.055, 2.4);
  } else {
    return pow(val, 2.2);
  }
}
float linearToGammaSpaceExact(float val) {
  if (val <= 0.0) {
    return 0.0;
  } else if (val <= 0.0031308) {
    return 12.92 * val;
  } else if (val < 1.0) {
    return 1.055 * pow(val, 0.4166667) - 0.055;
  } else {
    return pow(val, 0.45454545);
  }
}

vec4 packDepthToRGBA(float depth) {
  vec4 ret = vec4(1.0, 255.0, 65025.0, 160581375.0) * depth;
  ret = fract(ret);
  ret -= ret.yzww * vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0, 0.0);
  return ret;
}

float unpackRGBAToDepth(vec4 color) {
  return dot(color, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 160581375.0));
}