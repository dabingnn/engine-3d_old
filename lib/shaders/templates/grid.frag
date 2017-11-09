varying vec2 uv0;
varying vec4 wpos;
varying vec3 wnormal;

uniform vec2 tiling;

uniform vec3 baseColorWhite;
uniform vec3 baseColorBlack;
uniform sampler2D basePattern;
uniform vec2 basePatternTiling;
uniform vec2 basePatternOffset;

uniform vec4 subPatternColor;
uniform sampler2D subPattern;
uniform vec2 subPatternTiling;
uniform vec2 subPatternOffset;

uniform vec4 subPatternColor2;
uniform sampler2D subPattern2;
uniform vec2 subPattern2Tiling;
uniform vec2 subPattern2Offset;

void main () {
  vec2 uv = uv0 * tiling;
  vec2 uvBase = uv * basePatternTiling + basePatternOffset;
  vec2 uvSub = uv * subPatternTiling + subPatternOffset;
  vec2 uvSub2 = uv * subPattern2Tiling + subPattern2Offset;

  {{#useWorldPos}}
    if (abs(wnormal.x)>0.5) { // side
      uvBase = (wpos.zy * tiling * basePatternTiling) + basePatternOffset;
      uvSub = (wpos.zy * tiling * subPatternTiling) + subPatternOffset;
      uvSub2 = (wpos.zy * tiling * subPattern2Tiling) + subPattern2Offset;
    } else if (abs(wnormal.z)>0.5) { // front
      uvBase = (wpos.xy * tiling * basePatternTiling) + basePatternOffset;
      uvSub = (wpos.xy * tiling * subPatternTiling) + subPatternOffset;
      uvSub2 = (wpos.xy * tiling * subPattern2Tiling) + subPattern2Offset;
    } else { // top
      uvBase = (wpos.xz * tiling * basePatternTiling) + basePatternOffset;
      uvSub = (wpos.xz * tiling * subPatternTiling) + subPatternOffset;
      uvSub2 = (wpos.xz * tiling * subPattern2Tiling) + subPattern2Offset;
    }
  {{/useWorldPos}}

  vec4 texColBase = texture2D(basePattern, uvBase);
  vec4 texColSub = texture2D(subPattern, uvSub);
  vec4 texColSub2 = texture2D(subPattern2, uvSub2);

  vec4 color = vec4(baseColorWhite,1) * texColBase + vec4(baseColorBlack,1) * (vec4(1)-texColBase);
  color =
    color * (vec4(1) - texColSub) +
    (subPatternColor * subPatternColor.a + color * (1.0-subPatternColor.a)) * texColSub
    ;
  color =
    color * (vec4(1) - texColSub2) +
    (subPatternColor2 * subPatternColor2.a + color * (1.0-subPatternColor2.a)) * texColSub2
    ;

  gl_FragColor = color;
}