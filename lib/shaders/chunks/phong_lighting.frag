struct LightInfo {
  vec3 diffuse;
  {{#useSpecular}}
    vec3 specular;
  {{/useSpecular}}
};

LightInfo computeDirecionalLighting(
  vec3 lightDirection,
  vec3 lightColor,
  vec3 normal,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = -normalize(lightDirection);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl;

  {{#useSpecular}}
    vec3 dirH = normalize(viewDirection + lightDir);
    ndh = max(0.0, dot(normal, dirH));
    ndh = (ndl == 0.0) ? 0.0: ndh;
    ndh = pow(ndh, max(1.0, glossiness));
    lightingResult.specular = lightColor * ndh;
  {{/useSpecular}}

  return lightingResult;
}

LightInfo computePointLighting(
  vec3 lightPosition,
  vec3 lightColor,
  float lightRange,
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo lightingResult;
  float ndl = 0.0;
  float ndh = 0.0;
  vec3 lightDir = vec3(0, 0, 0);
  float attenuation = 1.0;
  lightDir = lightPosition - positionW;
  attenuation = max(0., 1.0 - length(lightDir) / lightRange);
  lightDir = normalize(lightDir);
  ndl = max(0.0, dot(normal, lightDir));
  lightingResult.diffuse = lightColor * ndl * attenuation;

  {{#useSpecular}}
    vec3 dirH = normalize(viewDirection + lightDir);
    ndh = max(0.0, dot(normal, dirH));
    ndh = (ndl == 0.0) ? 0.0: ndh;
    ndh = pow(ndh, max(1.0, glossiness));
    lightingResult.specular = lightColor * ndh * attenuation;
  {{/useSpecular}}

  return lightingResult;
}

LightInfo computeSpotLighting(
  vec3 lightPosition,
  vec3 lightDirection,
  vec3 lightColor,
  float lightRange,
  vec2 lightSpot,
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
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
  lightingResult.diffuse = lightColor * ndl * attenuation * cosConeAngle;

  {{#useSpecular}}
    vec3 dirH = normalize(viewDirection + lightDir);
    ndh = max(0.0, dot(normal, dirH));
    ndh = (ndl == 0.0) ? 0.0: ndh;
    ndh = pow(ndh, max(1.0, glossiness));
    lightingResult.specular = lightColor * ndh * attenuation * cosConeAngle;
  {{/useSpecular}}

  return lightingResult;
}

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

LightInfo getPhongLighting(
  vec3 normal,
  vec3 positionW,
  vec3 viewDirection,
  float glossiness
) {
  LightInfo result;
  result.diffuse = vec3(0, 0, 0);
  {{#useSpecular}}
    result.specular = vec3(0, 0, 0);
  {{/useSpecular}}
  LightInfo dirLighting;
  {{#directionalLightSlots}}
    dirLighting = computeDirecionalLighting(dir_light{{id}}_direction,dir_light{{id}}_color,normal, viewDirection, glossiness);
    result.diffuse += dirLighting.diffuse;
    {{#useSpecular}}
      result.specular += dirLighting.specular;
    {{/useSpecular}}
  {{/directionalLightSlots}}

  LightInfo pointLighting;
  {{#pointLightSlots}}
    pointLighting = computePointLighting(point_light{{id}}_position, point_light{{id}}_color, point_light{{id}}_range,
                                         normal, positionW, viewDirection, glossiness);
    result.diffuse += pointLighting.diffuse;
    {{#useSpecular}}
      result.specular += pointLighting.specular;
    {{/useSpecular}}
  {{/pointLightSlots}}

  LightInfo spotLighting;
  {{#spotLightSlots}}
    spotLighting = computeSpotLighting(spot_light{{id}}_position, spot_light{{id}}_direction, spot_light{{id}}_color,
                    spot_light{{id}}_range, spot_light{{id}}_spot,normal, positionW, viewDirection, glossiness);
    result.diffuse += spotLighting.diffuse;
    {{#useSpecular}}
      result.specular += spotLighting.specular;
    {{/useSpecular}}
  {{/spotLightSlots}}
  return result;
}
