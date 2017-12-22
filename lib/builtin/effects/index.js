export default [
  {
    name: 'grid',
    techniques: [{"stages":["opaque"],"params":[{"name":"tiling","type":5,"value":[1,1]},{"name":"baseColorWhite","type":8,"value":[1,1,1]},{"name":"baseColorBlack","type":8,"value":[0,0,0]},{"name":"basePattern","type":13,"value":null},{"name":"basePatternTiling","type":5,"value":[1,1]},{"name":"basePatternOffset","type":5,"value":[0,0]},{"name":"subPatternColor","type":9,"value":[1,1,1,1]},{"name":"subPattern","type":13,"value":null},{"name":"subPatternTiling","type":5,"value":[1,1]},{"name":"subPatternOffset","type":5,"value":[0,0]},{"name":"subPatternColor2","type":9,"value":[1,1,1,1]},{"name":"subPattern2","type":13,"value":null},{"name":"subPattern2Tiling","type":5,"value":[1,1]},{"name":"subPattern2Offset","type":5,"value":[0,0]}],"passes":[{"program":"grid"}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_WORLD_POS","value":false}]
  },
  {
    name: 'line',
    techniques: [{"stages":["opaque"],"params":[],"passes":[{"program":"line","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: []
  },
  {
    name: 'matcap',
    techniques: [{"stages":["opaque"],"params":[{"name":"mainTex","type":13,"value":null},{"name":"matcapTex","type":13,"value":null},{"name":"colorFactor","type":4,"value":0.5},{"name":"color","type":9,"value":[1,1,1,1]}],"passes":[{"program":"pbr","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_MAIN_TEX","value":false},{"name":"USE_SKINNING","value":false}]
  },
  {
    name: 'pbr-transparent',
    techniques: [{"stages":["transparent"],"params":[{"name":"albedo","type":9,"value":[1,1,1,1]},{"name":"albedoTiling","type":5,"value":[1,1]},{"name":"albedoOffset","type":5,"value":[0,0]},{"name":"albedoTexture","type":13,"value":null},{"name":"metallic","type":4,"value":1},{"name":"metallicTiling","type":5,"value":[1,1]},{"name":"metallicOffset","type":5,"value":[0,0]},{"name":"metallicTexture","type":13,"value":null},{"name":"roughness","type":4,"value":0.5},{"name":"roughnessTiling","type":5,"value":[1,1]},{"name":"roughnessOffset","type":5,"value":[0,0]},{"name":"roughnessTexture","type":13,"value":null},{"name":"ao","type":4,"value":0.2},{"name":"aoTiling","type":5,"value":[1,1]},{"name":"aoOffset","type":5,"value":[0,0]},{"name":"aoTexture","type":13,"value":null},{"name":"normalTiling","type":5,"value":[1,1]},{"name":"normalOffset","type":5,"value":[0,0]},{"name":"normalTexture","type":13,"value":null},{"name":"diffuseEnvTexture","type":14,"value":null},{"name":"specularEnvTexture","type":14,"value":null},{"name":"brdfLUT","type":13,"value":null},{"name":"maxReflectionLod","type":4,"value":9},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"pbr","cullMode":1029,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":0}],"layer":0},{"stages":["shadowCast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"blendMode":0,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_ALBEDO_TEXTURE","value":false},{"name":"USE_METALLIC_ROUGHNESS_TEXTURE","value":false},{"name":"USE_METALLIC_TEXTURE","value":false},{"name":"USE_ROUGHNESS_TEXTURE","value":false},{"name":"USE_AO_TEXTURE","value":false},{"name":"USE_IBL","value":false},{"name":"USE_TEX_LOD","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"USE_SKINNING","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0}]
  },
  {
    name: 'pbr',
    techniques: [{"stages":["opaque"],"params":[{"name":"albedo","type":9,"value":[1,1,1,1]},{"name":"albedoTiling","type":5,"value":[1,1]},{"name":"albedoOffset","type":5,"value":[0,0]},{"name":"albedoTexture","type":13,"value":null},{"name":"metallic","type":4,"value":1},{"name":"metallicTiling","type":5,"value":[1,1]},{"name":"metallicOffset","type":5,"value":[0,0]},{"name":"metallicTexture","type":13,"value":null},{"name":"roughness","type":4,"value":0.5},{"name":"roughnessTiling","type":5,"value":[1,1]},{"name":"roughnessOffset","type":5,"value":[0,0]},{"name":"roughnessTexture","type":13,"value":null},{"name":"ao","type":4,"value":0.2},{"name":"aoTiling","type":5,"value":[1,1]},{"name":"aoOffset","type":5,"value":[0,0]},{"name":"aoTexture","type":13,"value":null},{"name":"normalTiling","type":5,"value":[1,1]},{"name":"normalOffset","type":5,"value":[0,0]},{"name":"normalTexture","type":13,"value":null},{"name":"diffuseEnvTexture","type":14,"value":null},{"name":"specularEnvTexture","type":14,"value":null},{"name":"brdfLUT","type":13,"value":null},{"name":"maxReflectionLod","type":4,"value":9},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"pbr","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0},{"stages":["shadowCast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"blendMode":0,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_ALBEDO_TEXTURE","value":false},{"name":"USE_METALLIC_ROUGHNESS_TEXTURE","value":false},{"name":"USE_METALLIC_TEXTURE","value":false},{"name":"USE_ROUGHNESS_TEXTURE","value":false},{"name":"USE_AO_TEXTURE","value":false},{"name":"USE_IBL","value":false},{"name":"USE_TEX_LOD","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"USE_SKINNING","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0}]
  },
  {
    name: 'phong-transparent',
    techniques: [{"stages":["transparent"],"params":[{"name":"diffuseColor","type":9,"value":[0.8,0.8,0.8,1]},{"name":"diffuseTiling","type":5,"value":[1,1]},{"name":"diffuseOffset","type":5,"value":[0,0]},{"name":"diffuseTexture","type":13,"value":null},{"name":"specularColor","type":8,"value":[1,1,1]},{"name":"specularTiling","type":5,"value":[1,1]},{"name":"specularOffset","type":5,"value":[0,0]},{"name":"specularTexture","type":13,"value":null},{"name":"emissiveColor","type":8,"value":[0,0,0]},{"name":"emissiveTiling","type":5,"value":[1,1]},{"name":"emissiveOffset","type":5,"value":[0,0]},{"name":"emissiveTexture","type":13,"value":null},{"name":"glossiness","type":4,"value":10},{"name":"normalTiling","type":5,"value":[1,1]},{"name":"normalOffset","type":5,"value":[0,0]},{"name":"normalTexture","type":13,"value":null},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"phong","cullMode":1029,"depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":0}],"layer":0},{"stages":["shadowCast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_DIFFUSE_TEXTURE","value":false},{"name":"USE_SPECULAR_TEXTURE","value":false},{"name":"USE_EMISSIVE_TEXTURE","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SKINNING","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0}]
  },
  {
    name: 'phong',
    techniques: [{"stages":["opaque"],"params":[{"name":"diffuseColor","type":9,"value":[0.8,0.8,0.8,1]},{"name":"diffuseTiling","type":5,"value":[1,1]},{"name":"diffuseOffset","type":5,"value":[0,0]},{"name":"diffuseTexture","type":13,"value":null},{"name":"specularColor","type":8,"value":[1,1,1]},{"name":"specularTiling","type":5,"value":[1,1]},{"name":"specularOffset","type":5,"value":[0,0]},{"name":"specularTexture","type":13,"value":null},{"name":"emissiveColor","type":8,"value":[0,0,0]},{"name":"emissiveTiling","type":5,"value":[1,1]},{"name":"emissiveOffset","type":5,"value":[0,0]},{"name":"emissiveTexture","type":13,"value":null},{"name":"glossiness","type":4,"value":10},{"name":"normalTiling","type":5,"value":[1,1]},{"name":"normalOffset","type":5,"value":[0,0]},{"name":"normalTexture","type":13,"value":null},{"name":"alphaTestThreshold","type":4,"value":0}],"passes":[{"program":"phong","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0},{"stages":["shadowCast"],"params":[],"passes":[{"program":"shadow-depth","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_NORMAL_TEXTURE","value":false},{"name":"USE_DIFFUSE_TEXTURE","value":false},{"name":"USE_SPECULAR_TEXTURE","value":false},{"name":"USE_EMISSIVE_TEXTURE","value":false},{"name":"USE_ALPHA_TEST","value":false},{"name":"USE_SKINNING","value":false},{"name":"USE_SHADOW_MAP","value":false},{"name":"NUM_DIR_LIGHTS","value":0},{"name":"NUM_POINT_LIGHTS","value":0},{"name":"NUM_SPOT_LIGHTS","value":0},{"name":"NUM_SHADOW_LIGHTS","value":0}]
  },
  {
    name: 'simple',
    techniques: [{"stages":["opaque"],"params":[{"name":"color","type":9,"value":[0.4,0.4,0.4,1]}],"passes":[{"program":"simple","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_TEXTURE","value":false},{"name":"USE_COLOR","value":false}]
  },
  {
    name: 'skybox',
    techniques: [{"stages":["opaque"],"params":[{"name":"cubeMap","type":14,"value":null}],"passes":[{"program":"skybox","cullMode":0}],"layer":-1}],
    properties: {},
    defines: []
  },
  {
    name: 'sprite',
    techniques: [{"stages":["2d"],"params":[{"name":"mainTexture","type":13,"value":null}],"passes":[{"program":"sprite","depthTest":true,"depthWrite":false,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":1}],"layer":0}],
    properties: {},
    defines: []
  },
  {
    name: 'unlit-transparent',
    techniques: [{"stages":["transparent"],"params":[{"name":"color","type":9,"value":[1,1,1,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"mainTexture","type":13,"value":null}],"passes":[{"program":"unlit","cullMode":1029,"depthTest":true,"depthWrite":true,"blend":true,"blendEq":32774,"blendSrc":770,"blendDst":771,"blendAlphaEq":32774,"blendSrcAlpha":1,"blendDstAlpha":0}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_TEXTURE","value":false},{"name":"USE_COLOR","value":false},{"name":"USE_SKINNING","value":false}]
  },
  {
    name: 'unlit',
    techniques: [{"stages":["opaque"],"params":[{"name":"color","type":9,"value":[1,1,1,1]},{"name":"mainTiling","type":5,"value":[1,1]},{"name":"mainOffset","type":5,"value":[0,0]},{"name":"mainTexture","type":13,"value":null}],"passes":[{"program":"unlit","cullMode":1029,"depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: [{"name":"USE_TEXTURE","value":false},{"name":"USE_COLOR","value":false},{"name":"USE_SKINNING","value":false}]
  },
  {
    name: 'wireframe',
    techniques: [{"stages":["opaque"],"params":[{"name":"color","type":8,"value":[1,1,1]}],"passes":[{"program":"wireframe","depthTest":true,"depthWrite":true}],"layer":0}],
    properties: {},
    defines: []
  },
];