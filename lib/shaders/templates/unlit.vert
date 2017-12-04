attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;

#ifdef useTexture
  attribute vec2 a_uv0;
  varying vec2 uv0;
#endif

#ifdef useSkinning
  #include <skinning.vert>
#endif

void main () {
  vec4 pos = vec4(a_position, 1);

  #ifdef useSkinning
    pos = skinMatrix() * pos;
  #endif

  pos = viewProj * model * pos;

  #ifdef useTexture
    uv0 = a_uv0;
  #endif

  gl_Position = pos;
}