attribute vec3 a_position;
attribute vec3 a_normal;
uniform   mat4 model;
uniform   mat4 viewProj;
uniform   mat3 normalMatrix;
varying   vec2 matcapUV;

//{{#useMainTex}}
#ifdef useMainTex
  attribute vec2 a_uv0;
  varying   vec2 uv0;
#endif
//{{/useMainTex}}

//{{#useSkinning}}
#ifdef useSkinning
  //{{> skinning.vert}}
  #include <skinning.vert>
#endif
//{{/useSkinning}}

void main(void){
  //{{#useMainTex}}
  #ifdef useMainTex
    uv0 = a_uv0;
  #endif
  //{{/useMainTex}}

  vec4 pos = vec4(a_position, 1);
  //{{#useSkinning}}
  #ifdef useSkinning
    mat4 skinMat = skinMatrix();
    pos = skinMat * pos;
  #endif
  //{{/useSkinning}}
  pos = viewProj * model * pos;
  gl_Position = pos;

  vec4 normal = vec4(a_normal, 0);
  //{{#useSkinning}}
  #ifdef useSkinning
    normal = skinMat * normal;
  #endif
  //{{/useSkinning}}
  normal = vec4(normalize(normalMatrix * normal.xyz), 0);
  matcapUV = normal.xy;
  matcapUV = matcapUV * 0.5 + 0.5;
}