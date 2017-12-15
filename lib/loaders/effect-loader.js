import gfx from 'gfx.js';
import renderer from 'renderer.js';
import { vec2, vec3, vec4, color3, color4 } from 'vmath';
import resl from '../misc/resl';
import Effect from '../assets/effect';

const _typeMap = {
  float: renderer.PARAM_FLOAT,
  float2: renderer.PARAM_FLOAT2,
  float3: renderer.PARAM_FLOAT3,
  float4: renderer.PARAM_FLOAT4,
  color3: renderer.PARAM_COLOR3,
  color4: renderer.PARAM_COLOR4,
  texture2d: renderer.PARAM_TEXTURE_2D,
  textureCube: renderer.PARAM_TEXTURE_CUBE
};

const _passMap = {
  back: gfx.CULL_BACK,
  front: gfx.CULL_FRONT,
  add: gfx.BLEND_FUNC_ADD,
  subtract: gfx.BLEND_FUNC_SUBTRACT,
  reverseSubtract: gfx.BLEND_FUNC_REVERSE_SUBTRACT,
  zero: gfx.BLEND_ZERO,
  one: gfx.BLEND_ONE,
  srcColor: gfx.BLEND_SRC_COLOR,
  oneMinusSrcColor: gfx.BLEND_ONE_MINUS_SRC_COLOR,
  dstColor: gfx.BLEND_DST_COLOR,
  oneMinusDstColor: gfx.BLEND_ONE_MINUS_DST_COLOR,
  srcAlpha: gfx.BLEND_SRC_ALPHA,
  oneMinusSrcAlpha: gfx.BLEND_ONE_MINUS_SRC_ALPHA,
  dstAlpha: gfx.BLEND_DST_ALPHA,
  oneMinusDstAlpha: gfx.BLEND_ONE_MINUS_DST_ALPHA,
  constColor: gfx.BLEND_CONSTANT_COLOR,
  oneMinusConstColor: gfx.BLEND_ONE_MINUS_CONSTANT_COLOR,
  constAlpha: gfx.BLEND_CONSTANT_ALPHA,
  oneMinusConstAlpha: gfx.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  srcAlphaSaturate: gfx.BLEND_SRC_ALPHA_SATURATE,
  [true]: true,
  [false]: false
};

function createEffect(json) {
  let effectAsset = new Effect();
  effectAsset._name = json.name;
  // TODO: uuid ?
  let techniques = new Array(json.techniques.length);
  let values = {};
  for (let i = 0; i < json.techniques.length; ++i) {
    let jsonTech = json.techniques[i];

    for (let j = 0; j < jsonTech.params.length; ++j) {
      let param = jsonTech.params[j];
      switch(param.type) {
        case 'float':
          values[param.name] = param.value;
          break;
        case 'float2':
          values[param.name] = vec2.new(param.value[0], param.value[1]);
          break;
        case 'float3':
          values[param.name] = vec3.new(param.value[0], param.value[1], param.value[2]);
          break;
        case 'float4':
          values[param.name] = vec4.new(param.value[0], param.value[1], param.value[2], param.value[3]);
          break;
        case 'color3':
          values[param.name] = color3.new(param.value[0], param.value[1], param.value[2]);
          break;
        case 'color4':
          values[param.name] = color4.new(param.value[0], param.value[1], param.value[2], param.value[3]);
          break;
        case 'texture2d':
        case 'textureCube':
          values[param.name] = undefined;
          break;
        default:
          console.warn('unsupport param type in effect json.');
      }
      param.type = _typeMap[param.type];
    }

    let passes = new Array(jsonTech.passes.length);
    for (let j = 0; j < jsonTech.passes.length; ++j) {
      let jsonPass = jsonTech.passes[j];
      for (let key in jsonPass) {
        if (key === "program") {
          continue;
        }
        jsonPass[key] = _passMap[jsonPass[key]];
      }
      passes[j] = new renderer.Pass(jsonPass.program);
      passes[j].setDepth(jsonPass.depthTest, jsonPass.depthWrite);
      passes[j].setCullMode(jsonPass.cullMode);
      if (jsonPass.blend === true) {
        passes[j].setBlend(jsonPass.blendEq, jsonPass.blendSrc, jsonPass.blendDst, jsonPass.blendAlphaEq, jsonPass.blendSrcAlpha, jsonPass.blendDstAlpha);
      }
    }

    techniques[i] = new renderer.Technique(jsonTech.stages, jsonTech.params, passes);
  }

  effectAsset._effect = new renderer.Effect(techniques, values, json.options);

  return effectAsset;
}

export default function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
    },

    onDone(data) {
      const { json } = data;
      let effectAsset = createEffect(json);

      callback(null, effectAsset);
    }
  });
}
