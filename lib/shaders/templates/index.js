export default [
  {
    name: 'unlit',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\n{{#useTexture}}\n  attribute vec2 a_uv;\n  varying vec2 uv;\n{{/useTexture}}\n{{#useSkinning}}\n  {{> chunks.skinning}}\n{{/useSkinning}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    pos = skinMatrix() * pos;\n  {{/useSkinning}}\n  pos = viewProj * model * pos;\n  {{#useTexture}}\n    uv = a_uv;\n  {{/useTexture}}\n  gl_Position = pos;\n}',
    frag: '{{#useTexture}}\n  uniform sampler2D mainTexture;\n  varying vec2 uv;\n{{/useTexture}}\n{{#useColor}}\n  uniform vec4 color;\n{{/useColor}}\nvoid main () {\n  vec4 o = vec4(1, 1, 1, 1);\n  {{#useTexture}}\n    o *= texture2D(mainTexture, uv);\n  {{/useTexture}}\n  {{#useColor}}\n    o *= color;\n  {{/useColor}}\n  gl_FragColor = o;\n}',
    options: [
      { name: 'useTexture', },
      { name: 'useColor', },
      { name: 'useSkinning', },
    ],
  },
];