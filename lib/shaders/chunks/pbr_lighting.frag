struct LightInfo {
  vec3 lightDir;
  vec3 radiance;
}

{{#directionalLightSlots}}
  uniform vec3 dir_light{{id}}_direction;
  uniform vec3 dir_light{{id}}_color;
{{/directionalLightSlots}}

{{#pointLightSlots}}
  uniform vec3 point_light{{id}}_position;
  uniform vec3 point_light{{id}}_color;
{{/pointLightSlots}}

{{#spotLightSlots}}
  uniform vec3 spot_light{{id}}_position;
  uniform vec3 spot_light{{id}}_direction;
  uniform vec3 spot_light{{id}}_color;
  uniform vec2 spot_light{{id}}_spot;
{{/spotLightSlots}}

// directional light
LightInfo computeDirectionalLighting(
  vec3 lightDirection,
  vec3 lightColor
) {
  LightInfo ret;
  ret.lightDir = -normalize(lightDirection);
  ret.radiance = lightColor;

  return ret;
}

// point light
LightInfo computePointLighting(
  vec3 lightPosition,
  vec3 positionW,
  vec3 lightColor
) {
  LightInfo ret;
  vec3 lightDir = lightPosition - positionW;
  float distance = length(lightDir);
  float attenuation = 1.0 / (distance * distance);
  ret.lightDir = normalize(lightDir);
  ret.radiance = lightColor * attenuation;

  return ret;
}

// spot light
LightInfo computeSpotLight(
  vec3 lightPosition,
  vec3 positionW,
  vec3 lightDirection,
  vec3 lightColor,
  vec2 lightSpot
) {
  LightInfo ret;
  vec3 lightDir = lightPosition - positionW;
  float distance = length(lightDir);
  float attenuation = 1.0 / (distance * distance);
  float cosConeAngle = max(0., dot(lightDirection, -lightDir));
  cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;
  cosConeAngle = pow(cosConeAngle,lightSpot.y);
  ret.lightDir = normalize(lightDir);
  ret.radiance = lightColor * attenuation * cosConeAngle;

  return ret;
}