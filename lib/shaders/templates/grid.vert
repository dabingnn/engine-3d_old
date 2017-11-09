// precision highp float;

attribute vec2 a_uv0;
attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat3 normalMatrix;

varying vec2 uv0;
varying vec4 wpos;
varying vec3 wnormal;

void main () {
  uv0 = a_uv0;
  wpos = model * vec4(a_position, 1);
  wnormal = normalize(normalMatrix * a_normal);

  gl_Position = viewProj * wpos;
}