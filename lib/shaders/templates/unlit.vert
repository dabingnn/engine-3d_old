attribute vec3 a_position;

uniform mat4 model;
uniform mat4 viewProj;

{{#useTexture}}
  attribute vec2 a_uv0;
  varying vec2 uv0;
{{/useTexture}}

{{#useSkinning}}
  {{> skinning.vert}}
{{/useSkinning}}

void main () {
  vec4 pos = vec4(a_position, 1);

  {{#useSkinning}}
    pos = skinMatrix() * pos;
  {{/useSkinning}}

  pos = viewProj * model * pos;

  {{#useTexture}}
    uv0 = a_uv0;
  {{/useTexture}}

  gl_Position = pos;
}