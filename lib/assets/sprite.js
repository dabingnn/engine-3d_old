import Asset from './asset';
import { quat, vec3, mat4 } from 'vmath';
let _q_tmp = quat.create();
let _t_tmp = vec3.create();
let _s_tmp = vec3.new(1, 1, 1);
let _mat4_tmp = mat4.create();
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

  /**
   * texture matrix is used to map texcoords
   * if sprite is rotated
   * 3----4  is rotated to 1----3
   * |    |                |    |
   * |    |                |    |
   * 1----2                2----4
   */
  getTextureMatrix() {
    let texture = this._texture._texture;
    if (this._rotated) {
      vec3.set(_s_tmp, this._width, this._height, 1.0);
      mat4.fromScaling(this._textureMatrix, _s_tmp);
      mat4.fromZRotation(_mat4_tmp, -Math.PI / 2);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
      vec3.set(_t_tmp, this._x, texture._height - this._y, 0.0);
      mat4.fromTranslation(_mat4_tmp, _t_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
      vec3.set(_s_tmp, 1 / texture._width, 1 / texture._height, 1.0);
      mat4.fromScaling(_mat4_tmp, _s_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
    } else {
      vec3.set(_s_tmp, this._width, this._height, 1.0);
      mat4.fromScaling(this._textureMatrix, _s_tmp);
      vec3.set(_t_tmp, this._x, texture._height - (this._y + this._height), 0.0);
      mat4.fromTranslation(_mat4_tmp, _t_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
      vec3.set(_s_tmp, 1 / texture._width, 1 / texture._height, 1.0);
      mat4.fromScaling(_mat4_tmp, _s_tmp);
      mat4.multiply(this._textureMatrix, _mat4_tmp, this._textureMatrix);
    }
    return this._textureMatrix;
  }
}