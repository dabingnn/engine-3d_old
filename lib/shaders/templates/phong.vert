attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;
uniform mat4 normalMatrix;

{{#useTexture}}
  attribute vec2 a_uv;
  varying vec2 uv;
{{/useTexture}}

{{#useNormal}}
  attribute vec3 a_normal;
  varying vec3 v_normal;
{{/useNormal}}

varying vec3 v_posWorld;

{{#useSkinning}}
  {{> chunks.skinning}}
{{/useSkinning}}

void main () {
  vec4 pos = vec4(a_position, 1);

  {{#useSkinning}}
    pos = skinMatrix() * pos;
  {{/useSkinning}}

  v_posWorld = (model * pos).xyz;
  pos = viewProj * model * pos;
  
  {{#useTexture}}
    uv = a_uv;
  {{/useTexture}}

  {{#useNormal}}
    v_normal = (model * vec4(a_normal,0.0)).xyz;
    v_normal = normalize(v_normal);
  {{/useNormal}}

  gl_Position = pos;
}