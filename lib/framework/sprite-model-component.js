import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import SpriteMaterial from '../materials/sprite-material';
import gfx from 'gfx.js';
import { color4, mat4 } from 'vmath';
import { Pool } from 'memop';

const _defaultWidth = 64;
const _defaultHeight = 64;
const SPRITE_SIMPLE = 0;
const SPRIRE_SLICED = 1;

function _generateSimpleSpriteVerts(out, sprite, width, height) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;

  out[4] = width;
  out[5] = 0;
  out[6] = 1;
  out[7] = 0;

  out[8] = 0;
  out[9] = height;
  out[10] = 0;
  out[11] = 1;

  out[12] = width;
  out[13] = height;
  out[14] = 1;
  out[15] = 1;
}

// function _generateSlicedSpriteVerts(out, sprite, width, height) {
//   // todo implement it
//   return _generateSimpleSpriteVerts(out, sprite, width, height);
// }

// const _spriteIndicesTable = {
//   [SPRITE_SIMPLE]: new Uint8Array([0, 1, 2, 3, 2, 1]),
//   // todo change it to the right one
//   [SPRIRE_SLICED]: new Uint8Array([0, 1, 2, 3, 2, 1])
// };

// const _spriteVerticesTable = {
//   [SPRITE_SIMPLE]: _generateSimpleSpriteVerts,
//   // todo change it to the right one
//   [SPRIRE_SLICED]: _generateSlicedSpriteVerts
// }
// 2 pos + 2 uv + 3 color
let _floatPerVert = 7;
// let _simpleSpriteVertsPool = new Pool(() => {
//   new Float32Array(_floatPerVert * 4);
// }, 8);

let _simpleSpriteIndices = new Uint8Array([0, 1, 2, 3, 2, 1]);
let _simpleSpritePool = new Pool(() => {
  return {
    vertices: new Float32Array(_floatPerVert * 4),
    indices: _simpleSpriteIndices,
    node: null,
    effect: null
  }
}, 8);
export default class SpriteModelComponent extends Component {
  constructor() {
    super();

    this._material = new SpriteMaterial();
    this._material.color = color4.create();
    this._floatPerVerts = 4;
    this._width = _defaultWidth;
    this._height = _defaultHeight;
    this._sprite = null;
    this._type = SPRITE_SIMPLE;
  }

  onInit() {
    this._modelData = _simpleSpritePool.alloc();
    this._modelDataDirty = true;
  }

  set sprite(val) {
    this._sprite = val;
    this._material.mainTexture = val._texture;
    this._material.textureMatrix = val ? val.getTextureMatrix() : mat4.create();
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

  getModelData() {
    if (this._modelDataDirty) {
      this._modelDataDirty = false;
      // todo generate sprite item
      let item = this._modelData;
      item.effect = this._material._effect;
      this._modelData.node = this._entity;
      _generateSimpleSpriteVerts(item.vertices, this._sprite, this._width, this._height);
    }

    return this._modelData;
  }

  destroy() {
    _simpleSpritePool.free(this._modelData);
    this._modelData = null;
  }
}