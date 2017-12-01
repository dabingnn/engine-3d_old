{{#useNormalTexture}}
#extension GL_OES_standard_derivatives : enable
{{/useNormalTexture}}

{{> common.frag}}

{{#useUV0}}
  varying vec2 uv0;
{{/useUV0}}

{{#useNormal}}
  varying vec3 normal_w;
{{/useNormal}}

{{#useShadowMap}}
  {{> shadow_mapping.frag}}
{{/useShadowMap}}

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

{{#useNormalTexture}}
  uniform vec2 normalMapTiling;
  uniform vec2 normalMapOffset;
  uniform sampler2D normalTexture;
  uniform float normalScale;  //this is not used yet
  vec3 getNormal(vec3 pos, vec3 normal) {
    vec3 q0 = vec3( dFdx( pos.x ), dFdx( pos.y ), dFdx( pos.z ) );
    vec3 q1 = vec3( dFdy( pos.x ), dFdy( pos.y ), dFdy( pos.z ) );
    vec2 uv = uv0 * normalMapTiling + normalMapOffset;
    vec2 st0 = dFdx( uv.st );
    vec2 st1 = dFdy( uv.st );
    vec3 S = normalize( q0 * st1.t - q1 * st0.t );
    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
    vec3 N = normalize( normal );
    vec3 mapN = texture2D(normalTexture, uv0).rgb * 2.0 - 1.0;
    mapN.xy = 1.0 * mapN.xy;
    mat3 tsn = mat3( S, T, N );
    return normalize( tsn * mapN );
  }
{{/useNormalTexture}}

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
  {{#useNormalTexture}}
    normal = getNormal(pos_w, normal);
  {{/useNormalTexture}}
  phongLighting = getPhongLighting(normal, pos_w, viewDirection, mtl.glossiness);
  phongLighting.diffuse += sceneAmbient;

  {{#useShadowMap}}
    float shadow = computeShadowESM();//calculateShadow(pos_lightspace);
    gl_FragColor = composePhongShading(phongLighting, mtl) * shadow;
  {{/useShadowMap}}
  {{^useShadowMap}}
    gl_FragColor = composePhongShading(phongLighting, mtl);
  {{/useShadowMap}}
}