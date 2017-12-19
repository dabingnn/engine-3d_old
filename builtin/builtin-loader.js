import renderer from 'renderer.js';
import Effect from '../lib/assets/effect';
import { vec2, vec3, vec4, color3, color4 } from 'vmath';

function loadBuiltinEffects(data) {
  let effectNum = data.length;
  let effectAssets = new Array(effectNum);

  for (let i = 0; i < effectNum; ++i) {
    let effect = data[i];
    effectAssets[i] = new Effect();
    effectAssets[i]._name = effect.name;
    effectAssets[i]._uuid = `builtin-${effect.name}`;
    effectAssets[i]._loaded = true;
    let techNum = effect.techniques.length;
    let techniques = new Array(techNum);
    let props = {};

    for (let j = 0; j < techNum; ++j) {
      let tech = effect.techniques[j];

      for (let k = 0; k < tech.params.length; ++k) {
        let param = tech.params[k];
        switch(param.type) {
          case renderer.PARAM_FLOAT:
            props[param.name] = param.value;
            break;
          case renderer.PARAM_FLOAT2:
            props[param.name] = vec2.new(param.value[0], param.value[1]);
            break;
          case renderer.PARAM_FLOAT3:
            props[param.name] = vec3.new(param.value[0], param.value[1], param.value[2]);
            break;
          case renderer.PARAM_FLOAT4:
            props[param.name] = vec4.new(param.value[0], param.value[1], param.value[2], param.value[3]);
            break;
          case renderer.PARAM_COLOR3:
            props[param.name] = color3.new(param.value[0], param.value[1], param.value[2]);
            break;
          case renderer.PARAM_COLOR4:
            props[param.name] = color4.new(param.value[0], param.value[1], param.value[2], param.value[3]);
            break;
          case renderer.PARAM_TEXTURE_2D:
          case renderer.PARAM_TEXTURE_CUBE:
            props[param.name] = undefined;
            break;
          default:
            console.warn('unsupport param type in effect json.');
        }
      }

      let passNum = tech.passes.length;
      let passes = new Array(passNum);
      for (let k = 0; k < passNum; ++k) {
        let pass = tech.passes[k];
        passes[k] = new renderer.Pass(pass.program);
        if (pass.depthTest !== undefined && pass.depthWrite !== undefined) {
          passes[k].setDepth(pass.depthTest, pass.depthWrite);
        }
        if (pass.cullMode !== undefined) {
          passes[k].setCullMode(pass.cullMode);
        }
        if (pass.blend === true) {
          passes[k].setBlend(pass.blendEq, pass.blendSrc, pass.blendDst, pass.blendAlphaEq, pass.blendSrcAlpha, pass.blendDstAlpha);
        }
      }

      techniques[j] = new renderer.Technique(tech.stages, tech.params, passes, tech.layer);
    }

    effectAssets[i]._effect = new renderer.Effect(techniques, props, effect.defines);
  }

  return effectAssets;
}

export default {
  loadBuiltinEffects,
};