attribute vec3 a_position;

uniform mat4 view;
uniform mat4 proj;

varying vec3 vViewDir;
void main() {
  mat4 viewNoTrans = view;
  viewNoTrans[3][0] = viewNoTrans[3][1] = viewNoTrans[3][2] = 0.0;
  gl_Position = proj * viewNoTrans * vec4(a_position, 1.0);
  gl_Position.z = gl_Position.w - 0.00001;
  vViewDir = a_position;
  vViewDir.x *= -1.0;
}
