import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import SpriteMaterial from '../materials/sprite-material';
import SpriteModel from '../renderer/sprite-model';
import gfx from 'gfx.js';
import { color4, vec2, vec3, mat4 } from 'vmath';
import { Pool } from 'memop';

const _defaultWidth = 64;
const _defaultHeight = 64;
const SPRITE_SIMPLE = 0;
const SPRITE_SLICED = 1;

// todo: these code may be moved to another place
let _defaultSpriteUV = vec3.new(0, 0, 0);
function _generateSimpleSpriteVerts(out, sprite, width, height) {
  let uvs = sprite ? sprite.getUVs() : null;
  vec3.set(out.positions[0], 0, 0, 0);
  vec3.set(out.positions[1], width, 0, 0);
  vec3.set(out.positions[2], 0, height, 0);
  vec3.set(out.positions[3], width, height, 0);

  vec3.copy(out.uvs[0], uvs ? uvs[0] : _defaultSpriteUV);
  vec3.copy(out.uvs[1], uvs ? uvs[3] : _defaultSpriteUV);
  vec3.copy(out.uvs[2], uvs ? uvs[12] : _defaultSpriteUV);
  vec3.copy(out.uvs[3], uvs ? uvs[15] : _defaultSpriteUV);
}

let _xs_tmp = new Float32Array(4);
let _ys_tmp = new Float32Array(4);
function _generateSlicedSpriteVerts(out, sprite, width, height) {
  let uvs = sprite ? sprite.getUVs() : null;

  // x0, x1, x2, x3
  let xScale = 1.0;
  let yScale = 1.0;
  if (sprite._left + sprite._right > width) {
    xScale = width / (sprite._left + sprite._right);
  }
  if (sprite._bottom + sprite._top > height) {
    yScale = height / (sprite._bottom + sprite._top);
  }
  _xs_tmp[0] = 0;
  _xs_tmp[1] = (sprite ? sprite._left : 0) * xScale;
  _xs_tmp[2] = width - (sprite ? sprite._right : 0) * xScale;
  _xs_tmp[3] = width;
  _ys_tmp[0] = 0;
  _ys_tmp[1] = (sprite ? sprite._bottom : 0) * yScale;
  _ys_tmp[2] = height - (sprite ? sprite._top : 0) * yScale;
  _ys_tmp[3] = height;
  for (let row = 0; row < 4; ++row) {
    for (let column = 0; column < 4; ++column) {
      vec3.set(out.positions[row * 4 + column], _xs_tmp[column], _ys_tmp[row], 0);
    }
  }

  for (let i = 0; i < 16; ++i) {
    vec3.copy(out.uvs[i], uvs ? uvs[i] : _defaultSpriteUV);
  }
}

/**
 * simple sprite
 * v2------v3
 * |       |
 * |       |
 * |       |
 * v0      v1
 * sliced sprite
 * v12---v13---v14---v15
 * |      |     |     |
 * v08---v09---v10---v11
 * |      |     |     |
 * v04---v05---v06---v07
 * |      |     |     |
 * v00---v01---v02---v03
 */
let _simpleSpriteIndices = new Uint16Array([0, 1, 2, 3, 2, 1]);
let _slicedSpriteIndices = new Uint16Array([
  0, 1, 4, 5, 4, 1,
  1, 2, 5, 6, 5, 2,
  2, 3, 6, 7, 6, 3,
  4, 5, 8, 9, 8, 5,
  5, 6, 9, 10, 9, 6,
  6, 7, 10, 11, 10, 7,
  8, 9, 12, 13, 12, 9,
  9, 10, 13, 14, 13, 10,
  10, 11, 14, 15, 14, 11
]);
let _simpleSpritePool = new Pool(() => {
  let positions = [];
  let uvs = [];
  for (let i = 0; i < 4; ++i) {
    positions.push(vec3.create());
    uvs.push(vec3.create());
  }
  return {
    positions,
    uvs,
    indices: _simpleSpriteIndices,
  }
}, 8);

let _slicedSpritePool = new Pool(() => {
  let positions = [];
  let uvs = [];
  for (let i = 0; i < 16; ++i) {
    positions.push(vec3.create());
    uvs.push(vec3.create());
  }
  return {
    positions,
    uvs,
    indices: _slicedSpriteIndices,
  }
}, 8);

function _allocModelData(type) {
  if (type === SPRITE_SIMPLE) {
    return _simpleSpritePool.alloc();
  } else if (type === SPRITE_SLICED) {
    return _slicedSpritePool.alloc();
  } else {
    return null;
  }
}

function _freeModelData(type, modelData) {
  if (type === SPRITE_SIMPLE) {
    return _simpleSpritePool.free(modelData);
  } else if (type === SPRITE_SLICED) {
    return _slicedSpritePool.free(modelData);
  } else {
    return null;
  }
}

export default class SpriteComponent extends Component {
  constructor() {
    super();

    this._material = new SpriteMaterial();
    this._material.color = color4.create();
    this._floatPerVerts = 4;
    this._width = _defaultWidth;
    this._height = _defaultHeight;
    this._sprite = null;
    this._type = SPRITE_SIMPLE;
    this._model = new SpriteModel();
  }

  onInit() {
    this._model.setNode(this._entity);
    this._model.addEffect(this._material._effect);
    this._modelData = _allocModelData(this._type);
    this._model._modelData = this._modelData;
    this._modelDataDirty = true;
  }

  set type(val) {
    if (this._type !== val) {
      _freeModelData(this._type, this._modelData);
      this._type = val;
      this._modelData = _allocModelData(this._type);
      this._model._modelData = this._modelData;
      this._modelDataDirty = true;
    }
  }

  set sprite(val) {
    this._sprite = val;
    this._material.mainTexture = val._texture;
    this._modelDataDirty = true;
  }

  set color(val) {
    this._material.color = val;
  }

  // todo. update width and height info notification
  set width(val) {
    this._width = val;
    this._modelDataDirty = true;
  }

  set height(val) {
    this._height = val;
    this._modelDataDirty = true;
  }

  updateModelData() {
    if (this._modelDataDirty) {
      this._modelDataDirty = false;
      let item = this._modelData;
      if (this._type === SPRITE_SIMPLE) {
        _generateSimpleSpriteVerts(item, this._sprite, this._width, this._height);
      } else if (this._type == SPRITE_SLICED) {
        _generateSlicedSpriteVerts(item, this._sprite, this._width, this._height);
      } else {
      }
    }
  }

  destroy() {
    _freeModelData(this._type, this._modelData);
    this._modelData = null;
    this._model._modelData = null;
  }
}