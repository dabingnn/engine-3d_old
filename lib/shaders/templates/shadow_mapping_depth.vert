attribute vec3 a_position;

uniform mat4 model;
uniform mat4 lightSpaceMatrix;

void main() {
  gl_Position = lightSpaceMatrix * model * vec4(a_position, 1.0);
}