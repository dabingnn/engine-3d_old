attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat3 normalMatrix;

#ifdef useUV0
  attribute vec2 a_uv0;
  varying vec2 uv0;
#endif

#ifdef useNormal
  attribute vec3 a_normal;
  varying vec3 normal_w;
#endif

varying vec3 pos_w;

#ifdef useSkinning
  #include <skinning.vert>
#endif

#ifdef useShadowMap
  #if NUM_SHADOW_LIGHTS > 0
    #pragma for id in range(0, NUM_SHADOW_LIGHTS)
      uniform mat4 lightViewProjMatrix_{{id}};
      uniform float minDepth_{{id}};
      uniform float maxDepth_{{id}};
      varying vec4 pos_lightspace_{{id}};
      varying float vDepth_{{id}};
    #pragma endFor
  #endif
#endif

void main () {
  vec4 pos = vec4(a_position, 1);

  #ifdef useSkinning
    mat4 skinMat = skinMatrix();
    pos = skinMat * pos;
  #endif

  pos_w = (model * pos).xyz;
  pos = viewProj * model * pos;

  #ifdef useUV0
    uv0 = a_uv0;
  #endif

  #ifdef useNormal
    vec4 normal = vec4(a_normal, 0);
    #ifdef useSkinning
      normal = skinMat * normal;
    #endif
    normal_w = normalMatrix * normal.xyz;
    normal_w = normalize(normal_w);
  #endif

  #ifdef useShadowMap
    #if NUM_SHADOW_LIGHTS > 0
      #pragma for id in range(0, NUM_SHADOW_LIGHTS)
        pos_lightspace_{{id}} = lightViewProjMatrix_{{id}} * vec4(pos_w, 1.0);
        vDepth_{{id}} = (pos_lightspace_{{id}}.z + minDepth_{{id}}) / (minDepth_{{id}} + maxDepth_{{id}});
      #pragma endFor
    #endif
  #endif

  gl_Position = pos;
}