{{#useUV0}}
  varying vec2 uv0;
{{/useUV0}}

{{#useNormal}}
  varying vec3 normal_w;
{{/useNormal}}

varying vec3 pos_w;
uniform vec3 eye;

struct phongMaterial
{
  vec3 diffuse;
  vec3 emissive;
  vec3 specular;
  float glossiness;
  float opacity;
};

{{#useDiffuse}}
uniform vec3 diffuseColor;
{{#useDiffuseTexture}}
uniform sampler2D diffuseTexture;
{{/useDiffuseTexture}}
{{/useDiffuse}}

{{#useAmbient}}
uniform vec3 sceneAmbient;
{{/useAmbient}}

{{#useEmissive}}
uniform vec3 emissiveColor;
{{#useEmissiveTexture}}
uniform sampler2D emissiveTexture;
{{/useEmissiveTexture}}
{{/useEmissive}}

{{#useSpecular}}
uniform vec3 specularColor;
uniform float glossiness;

{{#useSpecularTexture}}
uniform sampler2D specularTexture;
{{/useSpecularTexture}}

{{/useSpecular}}

{{#useOpacity}}
uniform float opacity;
{{#useOpacityTexture}}
uniform sampler2D opacityTexture;
{{/useOpacityTexture}}
{{/useOpacity}}

{{#useAlphaTest}}
uniform float alphaTestThreshold;
{{/useAlphaTest}}

phongMaterial getPhongMaterial() {
  phongMaterial result;
  result.diffuse = vec3(0.8, 0.8, 0.8);
  result.emissive = vec3(0.0, 0.0, 0.0);
  result.specular = vec3(0.0, 0.0, 0.0);
  result.glossiness = 10.0;
  result.opacity = 1.0;
  
  {{#useDiffuse}}
  result.diffuse = diffuseColor;
    {{#useDiffuseTexture}}
      result.diffuse = result.diffuse * texture2D(diffuseTexture, uv0).rgb;
    {{/useDiffuseTexture}}
  {{/useDiffuse}}
  
  {{#useEmissive}}
  result.emissive = emissiveColor; 
    {{#useEmissiveTexture}}
      result.emissive = result.emissive * texture2D(emissiveTexture, uv0).rgb;
    {{/useEmissiveTexture}}
  {{/useEmissive}}

  {{#useSpecular}}
  result.specular = specularColor;
  result.glossiness = glossiness;
    {{#useSpecularTexture}}
      result.specular = result.specular * texture2D(specularTexture, uv0).rgb;
    {{/useSpecularTexture}}
  {{/useSpecular}}

  {{#useOpacity}}
  result.opacity = opacity;
    {{#useOpacityTexture}}
      result.opacity = result.opacity * texture2D(opacityTexture, uv0).a;
    {{/useOpacityTexture}}
  {{/useOpacity}}

  return result;
}

{{> phong_lighting.frag}}

vec4 composePhongShading(LightInfo lighting, phongMaterial mtl)
{
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);
  
  //diffuse is always calculated
  o.xyz = lighting.diffuse * mtl.diffuse;

  {{#useEmissive}}
  o.xyz += mtl.emissive;
  {{/useEmissive}}

  {{#useSpecular}}
  o.xyz += lighting.specular * mtl.specular;
  {{/useSpecular}}

  {{#useOpacity}}
  o.a = mtl.opacity;
  {{/useOpacity}}
  return o;
}

void main () {
  LightInfo phongLighting;
  vec3 viewDirection = normalize(eye - pos_w);
  
  phongMaterial mtl = getPhongMaterial();
  {{#useAlphaTest}}
  if(mtl.opacity < alphaTestThreshold) discard;
  {{/useAlphaTest}}
  phongLighting = getPhongLighting(normal_w, pos_w, viewDirection, mtl.glossiness);
  
  {{#useAmbient}}
  phongLighting.diffuse += sceneAmbient;
  {{/useAmbient}}

  gl_FragColor = composePhongShading(phongLighting, mtl);
}