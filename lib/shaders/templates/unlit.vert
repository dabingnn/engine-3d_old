attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;

{{#useTexture}}
  attribute vec2 a_uv;
  varying vec2 uv;
{{/useTexture}}

{{#useSkinning}}
  {{> chunks.skinning}}
{{/useSkinning}}

void main () {
  vec4 pos = vec4(a_position, 1);

  {{#useSkinning}}
    pos = skinMatrix() * pos;
  {{/useSkinning}}

  pos = viewProj * model * pos;

  {{#useTexture}}
    uv = a_uv;
  {{/useTexture}}

  gl_Position = pos;
}