{{#useTexture}}
  uniform sampler2D mainTexture;
  varying vec2 uv;
{{/useTexture}}

{{#useNormal}}
  varying vec3 normal_w;
{{/useNormal}}
varying vec3 pos_w;

struct LightInfo {
  vec3 diffuse;
  vec3 specular;
};

uniform vec3 eye;

{{#directionalLightSlots}}
  uniform vec3 dir_light{{id}}_direction;
  uniform vec3 dir_light{{id}}_color;
{{/directionalLightSlots}}

{{#pointLightSlots}}
  uniform vec3 point_light{{id}}_position;
  uniform vec3 point_light{{id}}_color;
  uniform float point_light{{id}}_range;
{{/pointLightSlots}}

{{#spotLightSlots}}
  uniform vec3 spot_light{{id}}_position;
  uniform vec3 spot_light{{id}}_direction;
  uniform vec3 spot_light{{id}}_color;
  uniform float spot_light{{id}}_range;
  uniform vec2 spot_light{{id}}_spot;
{{/spotLightSlots}}

LightInfo computeDirecionalLighting(vec3 lightDirection, vec3 lightColor, vec3 normal, vec3 viewDirection, float glossiness)
{
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = -normalize(lightDirection);
  ndl = max(0.0, dot(normal, lightDir));
  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness));
  lightingResult.diffuse = lightColor * ndl;
  lightingResult.specular = lightColor * ndh;

  return lightingResult;
}
  
LightInfo computePointLighting(vec3 lightPosition, vec3 lightColor, float lightRange, vec3 normal, vec3 positionW, vec3 viewDirection, float glossiness)
{
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = vec3(0, 0, 0);
  float attenuation = 1.0;
  lightDir = lightPosition - positionW;
  attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  lightDir = normalize(lightDir);
  ndl = max(0.0, dot(normal, lightDir));
  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness));

  lightingResult.diffuse = lightColor * ndl * attenuation;
  lightingResult.specular = lightColor * ndh * attenuation;

  return lightingResult;
}

LightInfo computeSpotLighting(vec3 lightPosition, vec3 lightDirection, vec3 lightColor, float lightRange, vec2 lightSpot,
                              vec3 normal, vec3 positionW, vec3 viewDirection, float glossiness)
{
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = vec3(0, 0, 0);
  float attenuation = 1.0;
  float cosConeAngle = 1.0;

  lightDir = lightPosition - positionW;
  attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  lightDir = normalize(lightDir);
  cosConeAngle = max(0., dot(lightDirection, -lightDir));
  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;
  cosConeAngle = pow(cosConeAngle,lightSpot.y);
  ndl = max(0.0, dot(normal, lightDir));
  vec3 dirH = normalize(viewDirection + lightDir);
  ndh = max(0.0, dot(normal, dirH));
  ndh = (ndl == 0.0) ? 0.0: ndh;
  ndh = pow(ndh, max(1.0, glossiness));
  lightingResult.diffuse = lightColor * ndl * attenuation * cosConeAngle;
  lightingResult.specular = lightColor * ndh * attenuation * cosConeAngle;
  return lightingResult;
}

void main () {
  LightInfo phongLighting;
  phongLighting.diffuse = vec3(0, 0, 0);
  phongLighting.specular = vec3(0, 0, 0);
  vec3 viewDirection = normalize(eye - pos_w);

  float materialGlossiness = 10.0;
  LightInfo dirLighting;
  {{#directionalLightSlots}}
    dirLighting = computeDirecionalLighting(dir_light{{id}}_direction,dir_light{{id}}_color,normal_w, viewDirection, materialGlossiness);
    phongLighting.diffuse += dirLighting.diffuse;
    phongLighting.specular += dirLighting.specular;
  {{/directionalLightSlots}}

  LightInfo pointLighting;
  {{#pointLightSlots}}
    pointLighting = computePointLighting(point_light{{id}}_position, point_light{{id}}_color, point_light{{id}}_range, 
                                         normal_w, pos_w, viewDirection, materialGlossiness);
    phongLighting.diffuse += pointLighting.diffuse;
    phongLighting.specular += pointLighting.specular;
  {{/pointLightSlots}}

  LightInfo spotLighting;
  {{#spotLightSlots}}
    spotLighting = computeSpotLighting(spot_light{{id}}_position, spot_light{{id}}_direction, spot_light{{id}}_color, 
                    spot_light{{id}}_range, spot_light{{id}}_spot,normal_w, pos_w, viewDirection, materialGlossiness);
    phongLighting.diffuse += spotLighting.diffuse;
    phongLighting.specular += spotLighting.specular;
  {{/spotLightSlots}}

  vec4 o = vec4( phongLighting.diffuse, 1);
  {{#useTexture}}
    o *= texture2D(mainTexture, uv);
  {{/useTexture}}

  gl_FragColor = o;
}