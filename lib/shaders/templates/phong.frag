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
    uniform vec2 diffuseTiling;
    uniform vec2 diffuseOffset;
    uniform sampler2D diffuseTexture;
  {{/useDiffuseTexture}}
{{/useDiffuse}}

uniform vec3 sceneAmbient;

{{#useEmissive}}
  uniform vec3 emissiveColor;
  {{#useEmissiveTexture}}
    uniform vec2 emissiveTiling;
    uniform vec2 emissiveOffset;
    uniform sampler2D emissiveTexture;
  {{/useEmissiveTexture}}
{{/useEmissive}}

{{#useSpecular}}
  uniform vec3 specularColor;
  uniform float glossiness;
  {{#useSpecularTexture}}
    uniform vec2 specularTiling;
    uniform vec2 specularOffset;
    uniform sampler2D specularTexture;
  {{/useSpecularTexture}}
{{/useSpecular}}

{{#useOpacity}}
  uniform float opacity;
  {{#useOpacityTexture}}
    uniform vec2 opacityTiling;
    uniform vec2 opacityOffset;
    uniform sampler2D opacityTexture;
  {{/useOpacityTexture}}
{{/useOpacity}}

{{#useNormalMap}}
  varying vec3 tangent_w;
  varying vec3 bitangent_w;
  uniform vec2 normalMapTiling;
  uniform vec2 normalMapOffset;
  uniform sampler2D normalTexture;
  uniform float normalScale;  //this is not used yet
  vec3 getNormal() {
    vec2 uv = uv0 * normalMapTiling + normalMapOffset;
    vec3 normal = texture2D(normalTexture, uv).rgb;
    mat3 TBN = mat3(normalize(tangent_w), normalize(bitangent_w), normalize(normal_w));
    return TBN * normal;
  }
{{/useNormalMap}}

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
  vec2 uv;
  {{#useDiffuse}}
    result.diffuse = diffuseColor;
    {{#useDiffuseTexture}}
      uv = uv0 * diffuseTiling + diffuseOffset;
      result.diffuse = result.diffuse * texture2D(diffuseTexture, uv).rgb;
    {{/useDiffuseTexture}}
  {{/useDiffuse}}
  
  {{#useEmissive}}
    result.emissive = emissiveColor; 
    {{#useEmissiveTexture}}
      uv = uv0 * emissiveTiling + emissiveOffset;
      result.emissive = result.emissive * texture2D(emissiveTexture, uv).rgb;
    {{/useEmissiveTexture}}
  {{/useEmissive}}

  {{#useSpecular}}
    result.specular = specularColor;
    result.glossiness = glossiness;
    {{#useSpecularTexture}}
      uv = uv0 * specularTiling + specularOffset;
      result.specular = result.specular * texture2D(specularTexture, uv).rgb;
    {{/useSpecularTexture}}
  {{/useSpecular}}

  {{#useOpacity}}
    result.opacity = opacity;
    {{#useOpacityTexture}}
      uv = uv0 * opacityTiling + opacityOffset;
      result.opacity = result.opacity * texture2D(opacityTexture, uv).a;
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
  vec3 normal = normal_w;
  {{#useNormalMap}}
  normal = getNormal();
  {{/useNormalMap}}
  phongLighting = getPhongLighting(normal, pos_w, viewDirection, mtl.glossiness);
  phongLighting.diffuse += sceneAmbient;

  gl_FragColor = composePhongShading(phongLighting, mtl);
}