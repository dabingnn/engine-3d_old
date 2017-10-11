export default [
  {
    name: 'phong',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\nuniform mat3 normalMatrix;\n{{#useUV0}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useUV0}}\n{{#useNormal}}\n  attribute vec3 a_normal;\n  varying vec3 normal_w;\n{{/useNormal}}\nvarying vec3 pos_w;\n{{#useSkinning}}\n  {{> skinning.vert}}\n{{/useSkinning}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    mat4 skinMat = skinMatrix();\n    pos = skinMat * pos;\n  {{/useSkinning}}\n  pos_w = (model * pos).xyz;\n  pos = viewProj * model * pos;\n  {{#useUV0}}\n    uv0 = a_uv0;\n  {{/useUV0}}\n  {{#useNormal}}\n    vec4 normal = vec4(a_normal, 0);\n    {{#useSkinning}}\n      normal = skinMat * normal;\n    {{/useSkinning}}\n    normal_w = normalMatrix * normal.xyz;\n    normal_w = normalize(normal_w);\n  {{/useNormal}}\n  gl_Position = pos;\n}',
    frag: '{{#useNormalTexture}}\n#extension GL_OES_standard_derivatives : enable\n{{/useNormalTexture}}\n{{#useUV0}}\n  varying vec2 uv0;\n{{/useUV0}}\n{{#useNormal}}\n  varying vec3 normal_w;\n{{/useNormal}}\nvarying vec3 pos_w;\nuniform vec3 eye;\nstruct phongMaterial\n{\n  vec3 diffuse;\n  vec3 emissive;\n  vec3 specular;\n  float glossiness;\n  float opacity;\n};\n{{#useDiffuse}}\n  uniform vec3 diffuseColor;\n  {{#useDiffuseTexture}}\n    uniform vec2 diffuseTiling;\n    uniform vec2 diffuseOffset;\n    uniform sampler2D diffuseTexture;\n  {{/useDiffuseTexture}}\n{{/useDiffuse}}\nuniform vec3 sceneAmbient;\n{{#useEmissive}}\n  uniform vec3 emissiveColor;\n  {{#useEmissiveTexture}}\n    uniform vec2 emissiveTiling;\n    uniform vec2 emissiveOffset;\n    uniform sampler2D emissiveTexture;\n  {{/useEmissiveTexture}}\n{{/useEmissive}}\n{{#useSpecular}}\n  uniform vec3 specularColor;\n  uniform float glossiness;\n  {{#useSpecularTexture}}\n    uniform vec2 specularTiling;\n    uniform vec2 specularOffset;\n    uniform sampler2D specularTexture;\n  {{/useSpecularTexture}}\n{{/useSpecular}}\n{{#useOpacity}}\n  uniform float opacity;\n  {{#useOpacityTexture}}\n    uniform vec2 opacityTiling;\n    uniform vec2 opacityOffset;\n    uniform sampler2D opacityTexture;\n  {{/useOpacityTexture}}\n{{/useOpacity}}\n{{#useNormalTexture}}\n  uniform vec2 normalMapTiling;\n  uniform vec2 normalMapOffset;\n  uniform sampler2D normalTexture;\n  uniform float normalScale;  \n  vec3 getNormal(vec3 pos, vec3 normal) {\n    vec3 q0 = vec3( dFdx( pos.x ), dFdx( pos.y ), dFdx( pos.z ) );\n    vec3 q1 = vec3( dFdy( pos.x ), dFdy( pos.y ), dFdy( pos.z ) );\n    vec2 uv = uv0 * normalMapTiling + normalMapOffset;\n    vec2 st0 = dFdx( uv.st );\n    vec2 st1 = dFdy( uv.st );\n    vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n    vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n    vec3 N = normalize( normal );\n    vec3 mapN = texture2D(normalTexture, uv0).rgb * 2.0 - 1.0;\n    mapN.xy = 1.0 * mapN.xy;\n    mat3 tsn = mat3( S, T, N );\n    return normalize( tsn * mapN );\n  }\n{{/useNormalTexture}}\n{{#useAlphaTest}}\n  uniform float alphaTestThreshold;\n{{/useAlphaTest}}\nphongMaterial getPhongMaterial() {\n  phongMaterial result;\n  result.diffuse = vec3(0.8, 0.8, 0.8);\n  result.emissive = vec3(0.0, 0.0, 0.0);\n  result.specular = vec3(0.0, 0.0, 0.0);\n  result.glossiness = 10.0;\n  result.opacity = 1.0;\n  vec2 uv;\n  {{#useDiffuse}}\n    result.diffuse = diffuseColor;\n    {{#useDiffuseTexture}}\n      uv = uv0 * diffuseTiling + diffuseOffset;\n      result.diffuse = result.diffuse * texture2D(diffuseTexture, uv).rgb;\n    {{/useDiffuseTexture}}\n  {{/useDiffuse}}\n  {{#useEmissive}}\n    result.emissive = emissiveColor;\n    {{#useEmissiveTexture}}\n      uv = uv0 * emissiveTiling + emissiveOffset;\n      result.emissive = result.emissive * texture2D(emissiveTexture, uv).rgb;\n    {{/useEmissiveTexture}}\n  {{/useEmissive}}\n  {{#useSpecular}}\n    result.specular = specularColor;\n    result.glossiness = glossiness;\n    {{#useSpecularTexture}}\n      uv = uv0 * specularTiling + specularOffset;\n      result.specular = result.specular * texture2D(specularTexture, uv).rgb;\n    {{/useSpecularTexture}}\n  {{/useSpecular}}\n  {{#useOpacity}}\n    result.opacity = opacity;\n    {{#useOpacityTexture}}\n      uv = uv0 * opacityTiling + opacityOffset;\n      result.opacity = result.opacity * texture2D(opacityTexture, uv).a;\n    {{/useOpacityTexture}}\n  {{/useOpacity}}\n  return result;\n}\n{{> phong_lighting.frag}}\nvec4 composePhongShading(LightInfo lighting, phongMaterial mtl)\n{\n  vec4 o = vec4(0.0, 0.0, 0.0, 1.0);\n  \n  o.xyz = lighting.diffuse * mtl.diffuse;\n  {{#useEmissive}}\n    o.xyz += mtl.emissive;\n  {{/useEmissive}}\n  {{#useSpecular}}\n    o.xyz += lighting.specular * mtl.specular;\n  {{/useSpecular}}\n  {{#useOpacity}}\n    o.a = mtl.opacity;\n  {{/useOpacity}}\n  return o;\n}\nvoid main () {\n  LightInfo phongLighting;\n  vec3 viewDirection = normalize(eye - pos_w);\n  phongMaterial mtl = getPhongMaterial();\n  {{#useAlphaTest}}\n    if(mtl.opacity < alphaTestThreshold) discard;\n  {{/useAlphaTest}}\n  vec3 normal = normal_w;\n  {{#useNormalTexture}}\n    normal = getNormal(pos_w, normal);\n  {{/useNormalTexture}}\n  phongLighting = getPhongLighting(normal, pos_w, viewDirection, mtl.glossiness);\n  phongLighting.diffuse += sceneAmbient;\n  gl_FragColor = composePhongShading(phongLighting, mtl);\n}',
    options: [
      { name: 'useSkinning', },
      { name: 'useNormal', },
      { name: 'directionalLightSlots', },
      { name: 'pointLightSlots', },
      { name: 'spotLightSlots', },
      { name: 'useUV0', },
      { name: 'useDiffuse', },
      { name: 'useDiffuseTexture', },
      { name: 'useAmbient', },
      { name: 'useEmissive', },
      { name: 'useEmissiveTexture', },
      { name: 'useSpecular', },
      { name: 'useSpecularTexture', },
      { name: 'useNormalTexture', },
      { name: 'useOpacity', },
      { name: 'useOpacityTexture', },
      { name: 'useAlphaTest', },
    ],
  },
  {
    name: 'skybox',
    vert: 'attribute vec3 a_position;\nuniform mat4 view;\nuniform mat4 proj;\nvarying vec3 viewDir;\nvoid main() {\n  mat4 viewNoTrans = view;\n  viewNoTrans[3][0] = viewNoTrans[3][1] = viewNoTrans[3][2] = 0.0;\n  gl_Position = proj * viewNoTrans * vec4(a_position, 1.0);\n  \n  \n  \n  \n  gl_Position.z = gl_Position.w - 0.00001;\n  viewDir = a_position;\n  viewDir.x *= -1.0;\n}\n',
    frag: 'varying vec3 viewDir;\nuniform samplerCube cubeMap;\nvoid main() {\n    gl_FragColor = textureCube(cubeMap, viewDir);\n}',
    options: [
    ],
  },
  {
    name: 'sprite',
    vert: 'attribute vec3 a_position;\nuniform mat4 viewProj;\nattribute vec2 a_uv0;\nvarying vec2 uv0;\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  pos = viewProj * pos;\n  vec4 uv = vec4(a_uv0, 0, 1);\n  uv0 = uv.xy;\n  gl_Position = pos;\n}',
    frag: '\nuniform sampler2D mainTexture;\nvarying vec2 uv0;\nuniform vec4 color;\nvoid main () {\n  vec4 o = vec4(1, 1, 1, 1);\n  o *= texture2D(mainTexture, uv0);\n  o *= color;\n  gl_FragColor = o;\n}',
    options: [
    ],
  },
  {
    name: 'unlit',
    vert: 'attribute vec3 a_position;\nuniform mat4 model;\nuniform mat4 viewProj;\n{{#useTexture}}\n  attribute vec2 a_uv0;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useSkinning}}\n  {{> skinning.vert}}\n{{/useSkinning}}\nvoid main () {\n  vec4 pos = vec4(a_position, 1);\n  {{#useSkinning}}\n    pos = skinMatrix() * pos;\n  {{/useSkinning}}\n  pos = viewProj * model * pos;\n  {{#useTexture}}\n    uv0 = a_uv0;\n  {{/useTexture}}\n  gl_Position = pos;\n}',
    frag: '{{#useTexture}}\n  uniform sampler2D mainTexture;\n  varying vec2 uv0;\n{{/useTexture}}\n{{#useColor}}\n  uniform vec4 color;\n{{/useColor}}\nvoid main () {\n  vec4 o = vec4(1, 1, 1, 1);\n  {{#useTexture}}\n    o *= texture2D(mainTexture, uv0);\n  {{/useTexture}}\n  {{#useColor}}\n    o *= color;\n  {{/useColor}}\n  gl_FragColor = o;\n}',
    options: [
      { name: 'useTexture', },
      { name: 'useColor', },
      { name: 'useSkinning', },
    ],
  },
];