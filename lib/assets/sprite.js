import Asset from './asset';
import { vec3, mat4 } from 'vmath';

let _t_tmp = vec3.create();
let _s_tmp = vec3.new(1, 1, 1);
let _mat4_tmp = mat4.create();
let _x_tmp = [0.0, 0.0, 0.0, 0.0];
let _y_tmp = [0.0, 0.0, 0.0, 0.0];

/**
 * v2------v3
 * |       |
 * |       |
 * |       |
 * v0------v1
 */
const _simpleIndices = [
  0, 1, 2, 3, 2, 1
];

/**
 * v12---v13---v14---v15
 * |      |     |     |
 * v08---v09---v10---v11
 * |      |     |     |
 * v04---v05---v06---v07
 * |      |     |     |
 * v00---v01---v02---v03
 */
const _slicedIndices = [
  0, 1, 4, 5, 4, 1,
  1, 2, 5, 6, 5, 2,
  2, 3, 6, 7, 6, 3,
  4, 5, 8, 9, 8, 5,
  5, 6, 9, 10, 9, 6,
  6, 7, 10, 11, 10, 7,
  8, 9, 12, 13, 12, 9,
  9, 10, 13, 14, 13, 10,
  10, 11, 14, 15, 14, 11
];

export default class Sprite extends Asset {
  constructor() {
    super();

    this._texture = null;
    this._x = 0;
    this._y = 0;
    this._width = 64;
    this._height = 64;
    this._rotated = false;

    // sliced information
    this._left = 0;
    this._right = 0;
    this._top = 0;
    this._bottom = 0;

    // cached 16 uvs
    /**
     * uv12  uv13  uv14  uv15
     * uv08  uv09  uv10  uv11
     * uv04  uv05  uv06  uv07
     * uv00  uv01  uv02  uv03
     */

    // ues vec3 for uv to make it better use mat4 texture matrix
    this._uvs = new Array(16);
    for (let i = 0; i < 16; ++i) {
      this._uvs[i] = vec3.create();
    }
    // cached texture matrix is used to map texcoords
    this._textureMatrix = mat4.create();
  }

  // commit values and calculated cached values
  commit() {
    // todo: check if some value exceeds the bounds, such as x < 0, or x + width > texture.width

    let texture = this._texture._texture;
    // calculate texture matrix
    /**
     * if sprite is rotated
     * 3----4  is rotated to 1----3
     * |    |                |    |
     * |    |                |    |
     * 1----2                2----4
     */
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

    // calculate uvs
    let uvs = this._uvs;
    uvs[0].x = uvs[4].x = uvs[8].x = uvs[12].x = 0.0;
    uvs[1].x = uvs[5].x = uvs[9].x = uvs[13].x = this._left / this._width;
    uvs[2].x = uvs[6].x = uvs[10].x = uvs[14].x = 1.0 - this._right / this._width;
    uvs[3].x = uvs[7].x = uvs[11].x = uvs[15].x = 1.0;

    uvs[0].y = uvs[1].y = uvs[2].y = uvs[3].y = 0.0;
    uvs[4].y = uvs[5].y = uvs[6].y = uvs[7].y = this._bottom / this._height;
    uvs[8].y = uvs[9].y = uvs[10].y = uvs[11].y = 1.0 - this._top / this._height;
    uvs[12].y = uvs[13].y = uvs[14].y = uvs[15].y = 1.0;
    // multiply uv by texture matrix
    for (let i = 0; i < this._uvs.length; ++i) {
      vec3.transformMat4(this._uvs[i], this._uvs[i], this._textureMatrix);
    }
  }

  getTextureMatrix() {
    return this._textureMatrix;
  }

  getUVs() {
    return this._uvs;
  }

  getSimpleIndices() {
    return _simpleIndices;
  }

  getSlicedIndices() {
    return _slicedIndices;
  }

  genSimpleVerts(out, width, height, pivotX, pivotY) {
    let xOffset = -pivotX * width;
    let yOffset = -pivotY * height;

    vec3.set(out.positions[0], 0 + xOffset, 0 + yOffset, 0);
    vec3.set(out.positions[1], width + xOffset, 0 + yOffset, 0);
    vec3.set(out.positions[2], 0 + xOffset, height + yOffset, 0);
    vec3.set(out.positions[3], width + xOffset, height + yOffset, 0);

    vec3.copy(out.uvs[0], this._uvs[0]);
    vec3.copy(out.uvs[1], this._uvs[3]);
    vec3.copy(out.uvs[2], this._uvs[12]);
    vec3.copy(out.uvs[3], this._uvs[15]);

    return out;
  }

  genSlicedVerts(out, width, height, pivotX, pivotY) {
    let xOffset = -pivotX * width;
    let yOffset = -pivotY * height;

    // x0, x1, x2, x3
    let xScale = 1.0;
    let yScale = 1.0;
    if (this._left + this._right > width) {
      xScale = width / (this._left + this._right);
    }
    if (this._bottom + this._top > height) {
      yScale = height / (this._bottom + this._top);
    }

    _x_tmp[0] = 0.0 + xOffset;
    _x_tmp[1] = this._left * xScale + xOffset;
    _x_tmp[2] = width - this._right * xScale + xOffset;
    _x_tmp[3] = width + xOffset;

    _y_tmp[0] = 0.0 + yOffset;
    _y_tmp[1] = this._bottom * yScale + yOffset;
    _y_tmp[2] = height - this._top * yScale + yOffset;
    _y_tmp[3] = height + yOffset;

    for (let row = 0; row < 4; ++row) {
      for (let column = 0; column < 4; ++column) {
        vec3.set(out.positions[row * 4 + column], _x_tmp[column], _y_tmp[row], 0.0);
      }
    }

    for (let i = 0; i < 16; ++i) {
      vec3.copy(out.uvs[i], this._uvs[i]);
    }

    return out;
  }
}