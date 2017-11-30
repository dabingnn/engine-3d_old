attribute vec3 a_position;

varying vec3 pos_w;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat3 normalMatrix;

{{#useNormal}}
  attribute vec3 a_normal;
  varying vec3 normal_w;
{{/useNormal}}

{{#useUV0}}
  attribute vec2 a_uv0;
  varying vec2 uv0;
{{/useUV0}}

{{#useSkinning}}
  {{> skinning.vert}}
{{/useSkinning}}

{{#useShadowMap}}
  {{#shadowLightSlots}}
    uniform mat4 lightViewProjMatrix_{{id}};
    //uniform vec2 depthValues;
    uniform float minDepth_{{id}};
    uniform float maxDepth_{{id}};
    varying vec4 pos_lightspace_{{id}};
    varying float vDepth_{{id}};
  {{/shadowLightSlots}}
{{/useShadowMap}}

void main () {
  vec4 pos = vec4(a_position, 1);

  {{#useSkinning}}
    mat4 skinMat = skinMatrix();
    pos = skinMat * pos;
  {{/useSkinning}}

  pos_w = (model * pos).xyz;
  pos = viewProj * model * pos;

  {{#useUV0}}
    uv0 = a_uv0;
  {{/useUV0}}

  {{#useNormal}}
    vec4 normal = vec4(a_normal, 0);
    {{#useSkinning}}
      normal = skinMat * normal;
    {{/useSkinning}}
    normal_w = normalMatrix * normal.xyz;
    //normal_w = normalize(normal_w);
  {{/useNormal}}

  {{#useShadowMap}}
    {{#shadowLightSlots}}
      pos_lightspace_{{id}} = lightViewProjMatrix_{{id}} * vec4(pos_w, 1.0);
      vDepth_{{id}} = (pos_lightspace_{{id}}.z + minDepth_{{id}}) / (minDepth_{{id}} + maxDepth_{{id}});
    {{/shadowLightSlots}}
  {{/useShadowMap}}

  gl_Position = pos;
}