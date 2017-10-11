attribute vec3 a_position;

uniform mat4 viewProj;

attribute vec2 a_uv0;
varying vec2 uv0;

void main () {
  vec4 pos = vec4(a_position, 1);

  pos = viewProj * pos;

  vec4 uv = vec4(a_uv0, 0, 1);
  uv0 = uv.xy;

  gl_Position = pos;
}