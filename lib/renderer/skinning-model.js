import renderer from 'renderer.js';
import { mat4 } from 'vmath';

let _tmp_m4 = mat4.create();

export default class SkinningModel extends renderer.Model {
  constructor() {
    super();

    // set from skin
    this._jointIndices = null;
    this._bindposes = null;

    // cloned from skin
    this._skeleton = null;

    // caches
    this._jointsTexture = null;
    this._data = null;
    this._updateOpts = null;
  }

  setSkin(skin) {
    this._jointIndices = skin._jointIndices;
    this._bindposes = skin._bindposes;
    this._skeleton = skin._skeleton.clone();
  }

  destroy() {
    if (this._jointsTexture) {
      this._jointsTexture.destroy();
    }
  }

  _updateCaches() {
    const texture = this._jointsTexture;

    // resize data
    this._data = new Float32Array(texture._width * texture._width * 4);

    // update texture opts
    this._updateOpts = {
      x: 0,
      y: 0,
      width: texture._width,
      height: texture._height,
      level: 0,
      image: this._data,
    };
  }

  updateMatrices() {
    const texture = this._jointsTexture;

    for (let i = 0; i < this._jointIndices.length; ++i) {
      let bindpose = this._bindposes[i];
      let idx = this._jointIndices[i];

      let worldMatrix = this._skeleton.getWorldMatrix(idx);
      mat4.multiply(_tmp_m4, worldMatrix, bindpose);

      this._data[16 * i + 0]  = _tmp_m4.m00;
      this._data[16 * i + 1]  = _tmp_m4.m01;
      this._data[16 * i + 2]  = _tmp_m4.m02;
      this._data[16 * i + 3]  = _tmp_m4.m03;
      this._data[16 * i + 4]  = _tmp_m4.m04;
      this._data[16 * i + 5]  = _tmp_m4.m05;
      this._data[16 * i + 6]  = _tmp_m4.m06;
      this._data[16 * i + 7]  = _tmp_m4.m07;
      this._data[16 * i + 8]  = _tmp_m4.m08;
      this._data[16 * i + 9]  = _tmp_m4.m09;
      this._data[16 * i + 10] = _tmp_m4.m10;
      this._data[16 * i + 11] = _tmp_m4.m11;
      this._data[16 * i + 12] = _tmp_m4.m12;
      this._data[16 * i + 13] = _tmp_m4.m13;
      this._data[16 * i + 14] = _tmp_m4.m14;
      this._data[16 * i + 15] = _tmp_m4.m15;
    }

    texture.updateSubImage(this._updateOpts);
  }
}