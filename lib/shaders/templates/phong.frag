{{#useTexture}}
  uniform sampler2D mainTexture;
  varying vec2 uv;
{{/useTexture}}

{{#useColor}}
  uniform vec4 color;
{{/useColor}}

{{#useNormal}}
  varying vec3 v_normal;
{{/useNormal}}
varying vec3 v_posWorld;

struct LightInfo {
  vec3 diffuse;
  vec3 specular;
};

uniform vec3 eyePosition;

{{#directionalLightSlots}}
  uniform vec3 dir_light{{.}}_direction;
  uniform vec3 dir_light{{.}}_color;
{{/directionalLightSlots}}

{{#pointLightSlots}}
  uniform vec3 point_light{{.}}_position;
  uniform vec3 point_light{{.}}_color;
  uniform float point_light{{.}}_range;
{{/pointLightSlots}}

{{#spotLightSlots}}
  uniform vec3 spot_light{{.}}_position;
  uniform vec3 spot_light{{.}}_direction;
  uniform vec3 spot_light{{.}}_color;
  uniform float spot_light{{.}}_range;
  uniform vec2 spot_light{{.}}_spot;
{{/spotLightSlots}}

  LightInfo computeDirecionalLighting(vec3 lightDirection, vec3 lightColor, vec3 normal, vec3 viewDirection, float glossiness)
  {
    LightInfo lightingResult;
    float ndl = 0.0;
    float ndh = 0.0;
    vec3 lightVec = -normalize(lightDirection);
    ndl = max(0.0, dot(normal, lightVec));
    vec3 dirH = normalize(viewDirection + lightVec);
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
    vec3 lightVec = vec3(0, 0, 0);
    float attenuation = 1.0;
    lightVec = lightPosition - positionW;
    attenuation = max(0., 1.0 - length(lightVec) / lightRange);
    lightVec = normalize(lightVec);
    ndl = max(0.0, dot(normal, lightVec));
    vec3 dirH = normalize(viewDirection + lightVec);
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
    vec3 lightVec = vec3(0, 0, 0);
    float attenuation = 1.0;
    float cosConeAngle = 1.0;

    lightVec = lightPosition - positionW;
    attenuation = max(0., 1.0 - length(lightVec) / lightRange);
    lightVec = normalize(lightVec);
    cosConeAngle = max(0., dot(lightDirection, -lightVec));
    cosConeAngle = cosConeAngle < lightSpot.x ? 0.0 : cosConeAngle;
    cosConeAngle = pow(cosConeAngle,lightSpot.y);
    ndl = max(0.0, dot(normal, lightVec));
    vec3 dirH = normalize(viewDirection + lightVec);
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
  vec3 viewDirection = normalize(eyePosition - v_posWorld);

  float materialGlossiness = 10.0;
  LightInfo dirLighting;
  {{#directionalLightSlots}}
    dirLighting = computeDirecionalLighting(dir_light{{.}}_direction,dir_light{{.}}_color,v_normal, viewDirection, materialGlossiness);
    phongLighting.diffuse += dirLighting.diffuse;
    phongLighting.specular += dirLighting.specular;
  {{/directionalLightSlots}}

  LightInfo pointLighting;
  {{#pointLightSlots}}
    pointLighting = computePointLighting(point_light{{.}}_position, point_light{{.}}_color, point_light{{.}}_range, 
                                         v_normal, v_posWorld, viewDirection, materialGlossiness);
    phongLighting.diffuse += pointLighting.diffuse;
    phongLighting.specular += pointLighting.specular;
  {{/pointLightSlots}}

  LightInfo spotLighting;
  {{#spotLightSlots}}
    spotLighting = computeSpotLighting(spot_light{{.}}_position, spot_light{{.}}_direction, spot_light{{.}}_color, 
                    spot_light{{.}}_range, spot_light{{.}}_spot,v_normal, v_posWorld, viewDirection, materialGlossiness);
    phongLighting.diffuse += spotLighting.diffuse;
    phongLighting.specular += spotLighting.specular;
  {{/spotLightSlots}}

  vec4 o = vec4( phongLighting.diffuse, 1);
  {{#useTexture}}
    o *= texture2D(mainTexture, uv);
  {{/useTexture}}

  {{#useColor}}
    o *= color;
  {{/useColor}}

  gl_FragColor = o;
}