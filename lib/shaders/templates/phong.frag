{{#useTexture}}
  uniform sampler2D mainTexture;
  varying vec2 uv0;
{{/useTexture}}

{{#useNormal}}
  varying vec3 normal_w;
{{/useNormal}}

varying vec3 pos_w;

uniform vec3 eye;

{{> phong_lighting.frag}}

void main () {
  LightInfo phongLighting;
  vec3 viewDirection = normalize(eye - pos_w);
  // this is a hack
  float materialGlossiness = 10.0;

  phongLighting = getPhongLighting(normal_w, pos_w, viewDirection, materialGlossiness);
  vec4 o = vec4( phongLighting.diffuse, 1);
  {{#useTexture}}
    o *= texture2D(mainTexture, uv0);
  {{/useTexture}}

  gl_FragColor = o;
}