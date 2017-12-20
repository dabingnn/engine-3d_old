import Effect from '../lib/assets/effect';
import builtinEffects from './effects/index';

function loadBuiltinEffects() {
  let effectNum = builtinEffects.length;
  let effectAssets = new Array(effectNum);

  for (let i = 0; i < effectNum; ++i) {
    let effect = builtinEffects[i];
    effectAssets[i] = new Effect();
    effectAssets[i]._name = effect.name;
    effectAssets[i]._uuid = `builtin-${effect.name}`;
    effectAssets[i]._loaded = true;
    effectAssets[i].techniques = effect.techniques;
    effectAssets[i].properties = effect.properties;
    effectAssets[i].defines = effect.defines;
  }

  return effectAssets;
}

export default {
  loadBuiltinEffects,
};