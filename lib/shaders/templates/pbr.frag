{{#useNormalTexture}}
#extension GL_OES_standard_derivatives : enable
{{/useNormalTexture}}
{{#useTexLod}}
#extension GL_EXT_shader_texture_lod: enable
{{/useTexLod}}

varying vec3 pos_w;
uniform vec3 eye;

const float PI = 3.14159265359;

{{#useNormal}}
  varying vec3 normal_w;
{{/useNormal}}

{{#useUV0}}
  varying vec2 uv0;
{{/useUV0}}

{{#useIBL}}
  uniform samplerCube diffuseEnvTexture;
  uniform samplerCube specularEnvTexture;
  uniform sampler2D brdfLUT;
  {{#useTexLod}}
    uniform float maxReflectionLod;
  {{/useTexLod}}
{{/useIBL}}

// material parameters
uniform vec3 albedo;
{{#useAlbedoTexture}}
  uniform vec2 albedoTiling;
  uniform vec2 albedoOffset;
  uniform sampler2D albedoTexture;
{{/useAlbedoTexture}}

{{#useMetalRoughnessTexture}}
  uniform vec2 metalRoughnessTiling;
  uniform vec2 metalRoughnessOffset;
  uniform vec2 sampler2D metalRoughnessTexture;
{{/useMetalRoughnessTexture}}

uniform float metallic;
{{#useMetallicTexture}}
  uniform vec2 metallicTiling;
  uniform vec2 metallicOffset;
  uniform sampler2D metallicTexture;
{{/useMetallicTexture}}

uniform float roughness;
{{#useRoughnessTexture}}
  uniform vec2 roughnessTiling;
  uniform vec2 roughnessOffset;
  uniform sampler2D roughnessTexture;
{{/useRoughnessTexture}}

uniform float ao;
{{#useAoTexture}}
  uniform vec2 aoTiling;
  uniform vec2 aoOffset;
  uniform sampler2D aoTexture;
{{/useAoTexture}}

{{#useNormalTexture}}
  uniform vec2 normalMapTiling;
  uniform vec2 normalMapOffset;
  uniform sampler2D normalTexture;
  // get world-space normal from normal texture
  vec3 getNormalFromTexture() {
    vec3 tangentNormal = texture2D(normalTexture, uv0).rgb * 2.0 - 1.0;
    vec3 q1  = dFdx(pos_w);
    vec3 q2  = dFdy(pos_w);
    vec2 uv  = uv0 * normalMapTiling + normalMapOffset;
    vec2 st1 = dFdx(uv);
    vec2 st2 = dFdy(uv);
    vec3 N   = normalize(normal_w);
    vec3 T   = normalize(q1*st2.t - q2*st1.t);
    vec3 B   = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
  }
{{/useNormalTexture}}

{{> pbr_lighting.frag}}

// Cook-Torrance BRDF model (https://learnopengl.com/#!PBR/Theory)
// D() Normal distribution function
float distributionGGX(vec3 N, vec3 H, float roughness) {
  float a = roughness * roughness;
  float a2 = a * a;
  float NdotH = max(dot(N, H), 0.0);
  float NdotH2 = NdotH * NdotH;
  float nom   = a2;
  float denom = (NdotH2 * (a2 - 1.0) + 1.0);
  denom = PI * denom * denom;

  return nom / denom;
}
// G() Geometry function
float geometrySchlickGGX(float NdotV, float roughness) {
  float r = (roughness + 1.0);
  float k = (r * r) / 8.0;
  float nom   = NdotV;
  float denom = NdotV * (1.0 - k) + k;

  return nom / denom;
}
float geometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float ggx2 = geometrySchlickGGX(NdotV, roughness);
  float ggx1 = geometrySchlickGGX(NdotL, roughness);

  return ggx1 * ggx2;
}
// F() Fresnel equation
// Optimized variant (presented by Epic at SIGGRAPH '13)
// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
  float fresnel = exp2((-5.55473 * cosTheta - 6.98316) * cosTheta);
  return F0 + (1.0 - F0) * fresnel;
}
vec3 fresnelSchlickRoughness(float cosTheta, vec3 F0, float roughness) {
  float fresnel = exp2((-5.55473 * cosTheta - 6.98316) * cosTheta);
  return F0 + (max(vec3(1.0 - roughness), F0) - F0) * fresnel;
}

// BRDF equation
vec3 brdf(LightInfo lightInfo, vec3 N, vec3 V, vec3 F0, vec3 albedo, float metallic, float roughness) {
  vec3 H = normalize(V + lightInfo.lightDir);
  float NDF = distributionGGX(N, H, roughness);
  float G   = geometrySmith(N, V, lightInfo.lightDir, roughness);
  vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);
  vec3 nominator    = NDF * G * F;
  float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, lightInfo.lightDir), 0.0) + 0.001; // 0.001 to prevent divide by zero.
  vec3 specular = nominator / denominator;
  // kS is equal to Fresnel
  vec3 kS = F;
  // for energy conservation, the diffuse and specular light can't
  // be above 1.0 (unless the surface emits light); to preserve this
  // relationship the diffuse component (kD) should equal 1.0 - kS.
  vec3 kD = vec3(1.0) - kS;
  // multiply kD by the inverse metalness such that only non-metals
  // have diffuse lighting, or a linear blend if partly metal (pure metals
  // have no diffuse light).
  kD *= 1.0 - metallic;
  float NdotL = max(dot(N, lightInfo.lightDir), 0.0);

  return (kD * albedo / PI + specular) * lightInfo.radiance * NdotL;
}


void main() {
  {{#useAlbedoTexture}}
    vec2 albedoUV = uv0 * albedoTiling + albedoOffset;
    vec3 albedo     = texture2D(albedoTexture, albedoUV).rgb; // without gamma-correction
  {{/useAlbedoTexture}}

  {{#useMetalRoughnessTexture}} // if using metalroughness texture
    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
    vec2 metalRoughnessUV = uv0 * metalRoughnessTiling + metalRoughnessOffset;
    vec3 metalRoughness = texture2D(metalRoughnessTexture, metalRoughnessUV).rgb;
    float metallic = metalRoughness.b;
    float roughness = metalRoughness.g;
  {{/useMetalRoughnessTexture}}
  {{^useMetalRoughnessTexture}} // else using separate metallic and roughness texture
    {{#useMetallicTexture}}
      vec2 metallicUV = uv0 * metallicTiling + metallicOffset;
      float metallic  = texture2D(metallicTexture, metallicUV).r;
    {{/useMetallicTexture}}
    {{#useRoughnessTexture}}
      vec2 roughnessUV = uv0 * roughnessTiling + roughnessOffset;
      float roughness  = texture2D(roughnessTexture, roughnessUV).r;
    {{/useRoughnessTexture}}
  {{/useMetalRoughnessTexture}}

  {{#useAoTexture}}
    vec2 aoUV = uv0 * aoTiling + aoOffset;
    float ao  = texture2D(aoTexture, aoUV).r;
  {{/useAoTexture}}

  vec3 N = normalize(normal_w);
  {{#useNormalTexture}}
    N = getNormalFromTexture();
  {{/useNormalTexture}}
  vec3 V = normalize(eye - pos_w);

  // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0
  // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)
  vec3 F0 = vec3(0.04);
  F0 = mix(F0, albedo, metallic);

  // reflection
  vec3 Lo = vec3(0.0);

  // point light (a 'for' loop to accumulate all light sources)
  {{#pointLightSlots}}
    LightInfo pointLight;
    pointLight = computePointLighting(point_light{{id}}_position, pos_w, point_light{{id}}_color, point_light{{id}}_range);
    Lo += brdf(pointLight, N, V, F0, albedo, metallic, roughness);
  {{/pointLightSlots}}

  // directional light (a 'for' loop to accumulate all light sources)
  {{#directionalLightSlots}}
    LightInfo directionalLight;
    directionalLight = computeDirectionalLighting(dir_light{{id}}_direction, dir_light{{id}}_color);
    Lo += brdf(directionalLight, N, V, F0, albedo, metallic, roughness);
  {{/directionalLightSlots}}

  // spot light (a 'for' loop to accumulate all light sources)
  {{#spotLightSlots}}
    LightInfo spotLight;
    spotLight = computeSpotLighting(spot_light{{id}}_position, pos_w, spot_light{{id}}_direction, spot_light{{id}}_color, spot_light{{id}}_spot, spot_light{{id}}_range);
    Lo += brdf(spotLight, N, V, F0, albedo, metallic, roughness);
  {{/spotLightSlots}}

  // ambient lighting, will be replaced by IBL if IBL used.
  vec3 ambient = vec3(0.03) * albedo * ao;

  {{#useIBL}}
    // generate ambient when using IBL.
    vec3 F = fresnelSchlickRoughness(max(dot(N, V), 0.0), F0, roughness);
    vec3 kS = F;
    vec3 kD = vec3(1.0) - kS;
    kD *= 1.0 - metallic;
    vec3 diffuseEnv = textureCube(diffuseEnvTexture, N).rgb;
    vec3 diffuse = diffuseEnv * albedo;
    // sample both the specularEnvTexture and the BRDF lut and combine them together as per the Split-Sum approximation to get the IBL specular part.
    vec3 R = reflect(-V, N);
    {{#useTexLod}}
      vec3 specularEnv = textureCubeLodEXT(specularEnvTexture, R, roughness * maxReflectionLod).rgb;
    {{/useTexLod}}
    {{^useTexLod}}
      vec3 specularEnv = textureCube(specularEnvTexture, R).rgb;
    {{/useTexLod}}
    vec2 brdf  = texture2D(brdfLUT, vec2(max(dot(N, V), 0.0), roughness)).rg;
    vec3 specular = specularEnv * (F * brdf.x + brdf.y);
    ambient = (kD * diffuse + specular) * ao;
  {{/useIBL}}

  vec3 color = ambient + Lo;
  // HDR tone mapping.
  color = color / (color + vec3(1.0));

  gl_FragColor = vec4(color, 1.0);
}