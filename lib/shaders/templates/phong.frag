#ifdef useNormalTexture
#extension GL_OES_standard_derivatives : enable
#endif

#include <common.frag>

#ifdef useUV0
  varying vec2 uv0;
#endif

#ifdef useNormal
  varying vec3 normal_w;
#endif

#ifdef useShadowMap
  #include <shadow-mapping.frag>
#endif

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

#ifdef useDiffuse
  uniform vec3 diffuseColor;
  #ifdef useDiffuseTexture
    uniform vec2 diffuseTiling;
    uniform vec2 diffuseOffset;
    uniform sampler2D diffuseTexture;
  #endif
#endif

uniform vec3 sceneAmbient;

#ifdef useEmissive
  uniform vec3 emissiveColor;
  #ifdef useEmissiveTexture
    uniform vec2 emissiveTiling;
    uniform vec2 emissiveOffset;
    uniform sampler2D emissiveTexture;
  #endif
#endif

#ifdef useSpecular
  uniform vec3 specularColor;
  uniform float glossiness;
  #ifdef useSpecularTexture
    uniform vec2 specularTiling;
    uniform vec2 specularOffset;
    uniform sampler2D specularTexture;
  #endif
#endif

#ifdef useOpacity
  uniform float opacity;
  #ifdef useOpacityTexture
    uniform vec2 opacityTiling;
    uniform vec2 opacityOffset;
    uniform sampler2D opacityTexture;
  #endif
#endif

#ifdef useNormalTexture
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
#endif

#ifdef useAlphaTest
  uniform float alphaTestThreshold;
#endif

phongMaterial getPhongMaterial() {
  phongMaterial result;
  result.diffuse = vec3(0.8, 0.8, 0.8);
  result.emissive = vec3(0.0, 0.0, 0.0);
  result.specular = vec3(0.0, 0.0, 0.0);
  result.glossiness = 10.0;
  result.opacity = 1.0;
  vec2 uv;
  #ifdef useDiffuse
    result.diffuse = diffuseColor;
    #ifdef useDiffuseTexture
      uv = uv0 * diffuseTiling + diffuseOffset;
      result.diffuse = result.diffuse * texture2D(diffuseTexture, uv).rgb;
    #endif
  #endif

  #ifdef useEmissive
    result.emissive = emissiveColor;
    #ifdef useEmissiveTexture
      uv = uv0 * emissiveTiling + emissiveOffset;
      result.emissive = result.emissive * texture2D(emissiveTexture, uv).rgb;
    #endif
  #endif

  #ifdef useSpecular
    result.specular = specularColor;
    result.glossiness = glossiness;
    #ifdef useSpecularTexture
      uv = uv0 * specularTiling + specularOffset;
      result.specular = result.specular * texture2D(specularTexture, uv).rgb;
    #endif
  #endif

  #ifdef useOpacity
    result.opacity = opacity;
    #ifdef useOpacityTexture
      uv = uv0 * opacityTiling + opacityOffset;
      result.opacity = result.opacity * texture2D(opacityTexture, uv).a;
    #endif
  #endif

  return result;
}

#include <phong-lighting.frag>

vec4 composePhongShading(LightInfo lighting, phongMaterial mtl)
{
  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);

  //diffuse is always calculated
  o.xyz = lighting.diffuse * mtl.diffuse;

  #ifdef useEmissive
    o.xyz += mtl.emissive;
  #endif

  #ifdef useSpecular
    o.xyz += lighting.specular * mtl.specular;
  #endif

  #ifdef useOpacity
    o.a = mtl.opacity;
  #endif
  return o;
}

void main () {
  LightInfo phongLighting;
  vec3 viewDirection = normalize(eye - pos_w);

  phongMaterial mtl = getPhongMaterial();
  #ifdef useAlphaTest
    if(mtl.opacity < alphaTestThreshold) discard;
  #endif
  vec3 normal = normal_w;
  #ifdef useNormalTexture
    normal = getNormal(pos_w, normal);
  #endif
  phongLighting = getPhongLighting(normal, pos_w, viewDirection, mtl.glossiness);
  phongLighting.diffuse += sceneAmbient;

  #ifdef useShadowMap
    float shadow = 1.0;
    #if NUM_SHADOW_LIGHTS > 0
      #pragma for id in range(0, NUM_SHADOW_LIGHTS)
        shadow *= computeShadowESM(shadowMap_{{id}}, pos_lightspace_{{id}}, vDepth_{{id}}, depthScale_{{id}}, darkness_{{id}}, frustumEdgeFalloff_{{id}});
      #pragma endFor
    #endif
    gl_FragColor = composePhongShading(phongLighting, mtl) * shadow;
  #else
    gl_FragColor = composePhongShading(phongLighting, mtl);
  #endif
}