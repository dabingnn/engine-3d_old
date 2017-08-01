attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat3 normalMatrix;

{{#useTexture}}
  attribute vec2 a_uv0;
  varying vec2 uv0;
{{/useTexture}}

{{#useNormal}}
  attribute vec3 a_normal;
  varying vec3 normal_w;
{{/useNormal}}

varying vec3 pos_w;

{{#useSkinning}}
  {{> chunks.skinning}}
{{/useSkinning}}

void main () {
  vec4 pos = vec4(a_position, 1);

  {{#useSkinning}}
    pos = skinMatrix() * pos;
  {{/useSkinning}}

  pos_w = (model * pos).xyz;
  pos = viewProj * model * pos;
  
  {{#useTexture}}
    uv0 = a_uv0;
  {{/useTexture}}

  {{#useNormal}}
    normal_w = normalMatrix * a_normal;
    normal_w = normalize(normal_w);
  {{/useNormal}}

  gl_Position = pos;
}