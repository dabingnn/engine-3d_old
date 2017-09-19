import Asset from './asset';
import { quat, vec3, mat4 } from 'vmath';
let _q_tmp = quat.create();
let _t_tmp = vec3.create();
let _s_tmp = vec3.new(1, 1, 1);
export default class Sprite extends Asset {
  constructor() {
    super();

    this._texture = null;
    this._x = 0;
    this._y = 0;
    this._width = 64;
    this._height = 64;
    this._rotated = false;
    this._textureMatrix = mat4.create();
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    super.unload();
  }

  getTextureMatrix() {
    let texture = this._texture._texture;
    vec3.set(_s_tmp, this._width / texture._width, this._height / texture._height, 1.0);
    vec3.set(_t_tmp, this._x / texture._width, 1.0 - (this._y + this._height) / texture._height, 0.0);
    mat4.fromRTS(this._textureMatrix, _q_tmp, _t_tmp, _s_tmp);
    return this._textureMatrix;
  }
}