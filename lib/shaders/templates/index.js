export default [
  {
    name: 'phong',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\nuniform mat3 normalMatrix;\n{{#useTexture}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useNormal}}\n  attribute vec3 a_normal;\n  varying vec3 normal_w;\n{{/useNormal}}\nvarying vec3 pos_w;\n{{#useSkinning}}\n  {{> chunks.skinning}}\n{{/useSkinning}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    pos = skinMatrix() * pos;\n  {{/useSkinning}}\n  pos_w = (model * pos).xyz;\n  pos = viewProj * model * pos;\n  \n  {{#useTexture}}\n    uv0 = a_uv0;\n  {{/useTexture}}\n  {{#useNormal}}\n    normal_w = normalMatrix * a_normal;\n    normal_w = normalize(normal_w);\n  {{/useNormal}}\n  gl_Position = pos;\n}',
    frag: '{{#useTexture}}\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useNormal}}\n  varying vec3 normal_w;\n{{/useNormal}}\nvarying vec3 pos_w;\nuniform vec3 eye;\n{{> phong_lighting.frag}}\nvoid main () {\n  LightInfo phongLighting;\n  vec3 viewDirection = normalize(eye - pos_w);\n  \n  float materialGlossiness = 10.0;\n  phongLighting = getPhongLighting(normal_w, pos_w, viewDirection, materialGlossiness);\n  vec4 o = vec4( phongLighting.diffuse, 1);\n  {{#useTexture}}\n    o *= texture2D(mainTexture, uv0);\n  {{/useTexture}}\n  gl_FragColor = o;\n}',
    options: [
      { name: 'useTexture', },
      { name: 'useSkinning', },
      { name: 'useNormal', },
      { name: 'useLight', },
      { name: 'directionalLightSlots', },
      { name: 'pointLightSlots', },
      { name: 'spotLightSlots', },
    ],
  },
  {
    name: 'standard',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\n{{#useTexture}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useSkinning}}\n  {{> skinning.vert}}\n{{/useSkinning}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    pos = skinMatrix() * pos;\n  {{/useSkinning}}\n  pos = viewProj * model * pos;\n  {{#useTexture}}\n    uv0 = a_uv0;\n  {{/useTexture}}\n  gl_Position = pos;\n}',
    frag: '{{#useTexture}}\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useColor}}\n  uniform vec4 color;\n{{/useColor}}\nvoid main () {\n  vec4 o = vec4(1, 1, 1, 1);\n  {{#useTexture}}\n    o *= texture2D(mainTexture, uv0);\n  {{/useTexture}}\n  {{#useColor}}\n    o *= color;\n  {{/useColor}}\n  gl_FragColor = o;\n}',
    options: [
      { name: 'useTexture', },
      { name: 'useColor', },
      { name: 'useSkinning', },
    ],
  },
];