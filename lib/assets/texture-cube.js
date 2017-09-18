import Texture from './texture';
import gfx from 'gfx.js';

export default class TextureCube extends Texture {
  constructor() {
    super();
    this._opts = {
      anisotropy: 1,
      wrapS: gfx.WRAP_REPEAT,
      wrapT: gfx.WRAP_REPEAT,
      minFilter: gfx.FILTER_LINEAR,
      magFilter: gfx.FILTER_LINEAR,
      mipFilter: gfx.FILTER_LINEAR,
    };
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    this._texture.destroy();
    super.unload();
  }

  set anisotropy(val) {
    this._opts.anisotropy = val;
  }
  get anisotropy() {
    return this._opts.anisotropy;
  }

  set wrapS(val) {
    this._opts.wrapS = val;
  }
  get wrapS() {
    return this._opts.wrapS;
  }

  set wrapT(val) {
    this._opts.wrapT = val;
  }
  get wrapT() {
    return this._opts.wrapT;
  }

  set minFilter(val) {
    this._opts.minFilter = val;
  }
  get minFilter() {
    return this._opts.minFilter;
  }

  set magFilter(val) {
    this._opts.magFilter = val;
  }
  get magFilter() {
    return this._opts.magFilter;
  }

  set mipFilter(val) {
    this._opts.mipFilter = val;
  }
  get mipFilter() {
    return this._opts.mipFilter;
  }

  commit() {
    this._texture.update(this._opts);
  }
}
