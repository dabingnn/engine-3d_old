import { Component } from 'ecs.js';
import { vec3, mat4, color4 } from 'vmath';

let _x_tmp = [0.0, 0.0, 0.0, 0.0];
let _y_tmp = [0.0, 0.0, 0.0, 0.0];
let _m4_tmp = mat4.create();

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

function _reallocVertexData(type) {
  let vertexCount = 4;
  let indices = null;

  if (type === 'simple') {
    vertexCount = 4;
    indices = _simpleIndices;
  } else if (type === 'sliced') {
    vertexCount = 16;
    indices = _slicedIndices;
  }

  let lposList = new Array(vertexCount);
  let wposList = new Array(vertexCount);
  let uvs = new Array(vertexCount);
  let color = color4.new();

  for (let i = 0; i < vertexCount; ++i) {
    wposList[i] = vec3.create();
    lposList[i] = vec3.create();
    uvs[i] = vec3.create();
  }

  return {
    wposList,
    lposList,
    uvs,
    color,
    indices,
  };
}

function _genSimpleVerts(out, sprite, x, y, w, h) {
  vec3.set(out.lposList[0], x, y, 0);
  vec3.set(out.lposList[1], x + w, y, 0);
  vec3.set(out.lposList[2], x, y + h, 0);
  vec3.set(out.lposList[3], x + w, y + h, 0);

  vec3.copy(out.uvs[0], sprite._uvs[0]);
  vec3.copy(out.uvs[1], sprite._uvs[3]);
  vec3.copy(out.uvs[2], sprite._uvs[12]);
  vec3.copy(out.uvs[3], sprite._uvs[15]);

  return out;
}

function _genSlicedVerts(out, sprite, x, y, w, h) {
  // x0, x1, x2, x3
  let xScale = 1.0;
  let yScale = 1.0;

  if (sprite._left + sprite._right > w) {
    xScale = w / (sprite._left + sprite._right);
  }
  if (sprite._bottom + sprite._top > h) {
    yScale = h / (sprite._bottom + sprite._top);
  }

  _x_tmp[0] = x;
  _x_tmp[1] = x + sprite._left * xScale;
  _x_tmp[2] = x + w - sprite._right * xScale;
  _x_tmp[3] = x + w;

  _y_tmp[0] = y;
  _y_tmp[1] = y + sprite._bottom * yScale;
  _y_tmp[2] = y + h - sprite._top * yScale;
  _y_tmp[3] = y + h;

  for (let row = 0; row < 4; ++row) {
    for (let column = 0; column < 4; ++column) {
      vec3.set(out.lposList[row * 4 + column], _x_tmp[column], _y_tmp[row], 0.0);
    }
  }

  for (let i = 0; i < 16; ++i) {
    vec3.copy(out.uvs[i], sprite._uvs[i]);
  }

  return out;
}

export default class ImageComponent extends Component {
  constructor() {
    super();

    this._material = null;
    this._type = 'simple';
    this._sprite = null;
    this._color = color4.create();

    this._cachedVertexData = _reallocVertexData(this._type);
    this._vertexDataDirty = true;
  }

  onInit() {
    this._entity.on('widget-rect-changed', this._onRectChanged);

    if (this._material === null) {
      this._material = this._engine.assets.get('builtin-material-sprite');
    }
  }

  onDestroy() {
    this._entity.off('widget-rect-changed', this._onRectChanged);
  }

  _onRectChanged() {
    this._vertexDataDirty = true;
  }

  get material() {
    return this._material;
  }
  set material(val) {
    if (val !== this._material) {
      this._material = val;
    }
  }

  get type() {
    return this._type;
  }
  set type(val) {
    if (val !== this._type) {
      this._type = val;

      this._cachedVertexData = _reallocVertexData(this._type);
      this._vertexDataDirty = true;
    }
  }

  get sprite() {
    return this._sprite;
  }
  set sprite(val) {
    if (val !== this._sprite) {
      this._sprite = val;
    }
  }

  get color() {
    return this._color;
  }
  set color(val) {
    color4.copy(this._color, val);
  }

  calcVertexData(x, y, w, h) {
    if (this._vertexDataDirty) {
      this._vertexDataDirty = false;
      let sprite = this._sprite;
      if (sprite === null) {
        sprite = this._engine.assets.get('default-sprite');
      }

      color4.copy(this._cachedVertexData.color, this._color);

      if (this._type === 'simple') {
        _genSimpleVerts(this._cachedVertexData, sprite, x, y, w, h);
      } else if (this._type == 'sliced') {
        _genSlicedVerts(this._cachedVertexData, sprite, x, y, w, h);
      }
    }

    this._entity.getWorldMatrix(_m4_tmp);

    for (let i = 0; i < this._cachedVertexData.lposList.length; ++i) {
      let lpos = this._cachedVertexData.lposList[i];
      let wpos = this._cachedVertexData.wposList[i];

      vec3.transformMat4(wpos, lpos, _m4_tmp);
    }

    return this._cachedVertexData;
  }
}