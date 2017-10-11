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
const SPRIRE_SLICED = 1;

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
// let _simpleSpriteVertsPool = new Pool(() => {
//   new Float32Array(_floatPerVert * 4);
// }, 8);

let _simpleSpriteIndices = new Uint8Array([0, 1, 2, 3, 2, 1]);
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
    this._modelData = _simpleSpritePool.alloc();
    this._model._modelData = this._modelData;
    this._modelDataDirty = true;
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
      _generateSimpleSpriteVerts(item, this._sprite, this._width, this._height);
    }
  }

  destroy() {
    _simpleSpritePool.free(this._modelData);
    this._modelData = null;
  }
}