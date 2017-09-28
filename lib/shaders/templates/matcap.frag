precision mediump float;

uniform sampler2D matcapTex;
uniform float mixRate;
varying vec2 matcapUv;

{{#useMainTex}}
  varying vec2 uv0;
  uniform sampler2D mainTex;
{{/useMainTex}}

{{#useMainColor}}
  uniform vec4 mainColor;
{{/useMainColor}}

void main(void){
    vec4 color = vec4(1, 1, 1, 1);
    {{#useMainTex}}
      color *= texture2D(mainTex,uv0);
    {{/useMainTex}}
    {{#useMainColor}}
      color *= mainColor;
    {{/useMainColor}}
    vec4 matcapColor = texture2D(matcapTex,matcapUv);
    gl_FragColor = color * mixRate + matcapColor * (1.0 - mixRate);
}