import Asset from './asset';
import gfx from 'gfx.js';
import enums from '../enums';

export default class Material extends Asset {
  constructor() {
    super();

    this._effectAsset = null; // effect asset
    this._blendType = enums.BLEND_CUSTOM;
  }

  set effectAsset(val) {
    this._effectAsset = val;
  }

  get effectAsset() {
    return this._effectAsset;
  }

  set blendType(val) {
    if (this._blendType === val) {
      return;
    }
    // TODO: should get mainTech, mainPass in this way ??
    let mainTech = this._effectAsset.effect.getTechnique('opaque');
    let mainPass = mainTech.passes[0];
    if (val === enums.BLEND_NONE) {
      mainTech.setStages(['opaque']);
      mainPass._blend = false;
      mainPass.setDepth(true, true);
    } else if (val === enums.BLEND_NORMAL) {
      mainTech.setStages(['transparent']);
      mainPass.setDepth(true, false);
      mainPass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_ONE, gfx.BLEND_ZERO
      );
    }
  }

  setProperty(name, val) {
    this._effectAsset.effect.setProperty(name, val);
  }

  define(name, val) {
    this._effectAsset.effect.define(name, val);
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // TODO: what should we do here ???

    super.unload();
  }
}