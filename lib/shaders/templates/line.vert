// precision highp float;

attribute vec3 a_position;
attribute vec3 a_color;

uniform mat4 model;
uniform mat4 viewProj;

varying vec3 color;

void main () {
  vec4 pos = viewProj * model * vec4(a_position, 1);
  color = a_color;

  gl_Position = pos;
}