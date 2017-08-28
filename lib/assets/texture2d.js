import Texture from './texture';
import gfx from 'gfx.js';

export default class Texture2D extends Texture {
  constructor() {
    super();
    this._textureOpts = {
      wrapS: gfx.WRAP_REPEAT,
      wrapT: gfx.WRAP_REPEAT,
      minFilter: gfx.FILTER_LINEAR,
      magFilter: gfx.FILTER_LINEAR,
      mipFilter: gfx.FILTER_LINEAR,
    };
  }

  set wrapS(val) {
    this._textureOpts.wrapS = val;
  }
  get wrapS() {
    return this._textureOpts.wrapS;
  }
  set wrapT(val) {
    this._textureOpts.wrapT = val;
  }
  get wrapT() {
    return this._textureOpts.wrapT;
  }
  set minFilter(val) {
    this._textureOpts.minFilter = val;
  }
  get minFilter() {
    return this._textureOpts.minFilter;
  }
  set magFilter(val) {
    this._textureOpts.magFilter = val;
  }
  get magFilter() {
    return this._textureOpts.magFilter;
  }
  set mipFilter(val) {
    this._textureOpts.mipFilter = val;
  }
  get mipFilter() {
    return this._textureOpts.mipFilter;
  }

  commit() {
    this._texture.update(this._textureOpts);
  }
}
