attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;

attribute vec2 a_uv0;
varying vec2 uv0;
// uniform mat4 textureMatrix;

void main () {
  vec4 pos = vec4(a_position, 1);

  pos = viewProj * model * pos;

  // vec4 uv = textureMatrix * vec4(a_uv0, 0, 1);
  // uv0 = uv.xy;
  uv0 = a_uv0;

  gl_Position = pos;
}