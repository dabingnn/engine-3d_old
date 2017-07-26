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

  vec3 computeDirecionalLighting(vec3 normal)
  {
    vec3 color = vec3(0, 0, 0);
    float ndl = 0.0;
    {{#directionalLightSlots}}
      ndl = max(0.0, dot(normal, -dir_light{{.}}_direction));
      color += dir_light{{.}}_color * ndl;
    {{/directionalLightSlots}}

    return color;
  }

  vec3 computePointLighting(vec3 normal, vec3 positionW)
  {
    vec3 color = vec3(0, 0, 0);
    float ndl = 0.0;
    vec3 lightVec = vec3(0, 0, 0);
    float attenuation = 1.0;
    {{#pointLightSlots}}
    lightVec = point_light{{.}}_position - positionW;
    attenuation = max(0., 1.0 - length(lightVec) / point_light{{.}}_range);
    ndl = max(0.0, dot(normal, normalize(lightVec)));
    color += point_light{{.}}_color * ndl * attenuation;
    {{/pointLightSlots}}

    return color;
  }

  vec3 computeSpotLighting(vec3 normal, vec3 positionW)
  {
    vec3 color = vec3(0, 0, 0);
    float ndl = 0.0;
    vec3 lightVec = vec3(0, 0, 0);
    float attenuation = 1.0;
    float cosConeAngle = 1.0;

    {{#spotLightSlots}}
    lightVec = spot_light{{.}}_position - positionW;
    attenuation = max(0., 1.0 - length(lightVec) / spot_light{{.}}_range);
    cosConeAngle = max(0., dot(spot_light{{.}}_direction, -normalize(lightVec)));
    cosConeAngle = cosConeAngle < spot_light{{.}}_spot.x ? 0.0 : cosConeAngle;
    cosConeAngle = pow(cosConeAngle,spot_light{{.}}_spot.y);
    ndl = max(0.0, dot(normal, normalize(lightVec)));
    color += spot_light{{.}}_color * ndl * attenuation * cosConeAngle;
    {{/spotLightSlots}}

    return color;
  }

void main () {
  vec4 o = vec4(0, 0, 0, 1);
  {{#directionalLightSlots}}
    o.xyz += computeDirecionalLighting(v_normal);
  {{/directionalLightSlots}}

  {{#pointLightSlots}}
    o.xyz += computePointLighting(v_normal, v_posWorld);
  {{/pointLightSlots}}

  {{#spotLightSlots}}
    o.xyz += computeSpotLighting(v_normal, v_posWorld);
  {{/spotLightSlots}}

  {{#useTexture}}
    o *= texture2D(mainTexture, uv);
  {{/useTexture}}

  {{#useColor}}
    o *= color;
  {{/useColor}}

  gl_FragColor = o;
}