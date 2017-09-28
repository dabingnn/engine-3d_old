attribute vec3 a_position;
attribute vec3 a_normal;
uniform   mat4 model;
uniform   mat4 viewProj;
uniform   mat3 normalMatrix;
varying   vec2 matcapUV;

{{#useMainTex}}
  attribute vec2 a_uv0;
  varying   vec2 uv0;
{{/useMainTex}}

{{#useSkinning}}
  {{> skinning.vert}}
{{/useSkinning}}

void main(void){
    {{#useMainTex}}
      uv0 = a_uv0;
    {{/useMainTex}}

    vec4 pos = vec4(a_position, 1);
    {{#useSkinning}}
      mat4 skinMat = skinMatrix();
      pos = skinMat * pos;
    {{/useSkinning}}
    pos = viewProj * model * pos;
    gl_Position = pos;

    vec4 normal = vec4(a_normal, 0);
    {{#useSkinning}}
      normal = skinMat * normal;
    {{/useSkinning}}
    normal = vec4(normalize(normalMatrix * normal.xyz), 0);
    matcapUV = normal.xy;
    matcapUV = matcapUV * 0.5 + 0.5;
}