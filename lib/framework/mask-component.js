import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { color4, vec2, vec3, mat4 } from 'vmath';
import RenderDataInterface from '../renderer/render-data-interface';
import SpriteMaterial from '../materials/sprite-material';

let _maskIndices = new Uint16Array([0, 1, 2, 3, 2, 1]);
let _dummyColor = [color4.new(0, 0, 1, 1), color4.new(1, 0, 0, 1)];
let _dummyUVs = new Array(4);
_dummyUVs[0] = vec3.new(0, 0, 1);
_dummyUVs[1] = vec3.new(1, 0, 1);
_dummyUVs[2] = vec3.new(0, 1, 1);
_dummyUVs[3] = vec3.new(1, 1, 1);
class _RenderData extends RenderDataInterface {
  constructor(owner, index) {
    super();
    this._owner = owner;
    this._index = index;
  }

  getNode() {
    return this._owner._entity;
  }

  getEffect() {
    return this._owner._materials[this._index]._effect;
  }

  getPositions() {
    return this._owner._positions;
  }

  getUVs() {
    return _dummyUVs;
  }

  getIndices() {
    return _maskIndices;
  }

  getColor() {
    return _dummyColor[this._index];
  }

  getVertexCount() {
    return 4;
  }

  getIndexCount() {
    return 6;
  }

}

export default class MaskComponent extends Component {
  constructor() {
    super();
    let positions = this._positions = new Array(4);
    for (let i = 0; i < 4; ++i) {
      positions[i] = vec3.create();
    }

    positions[0].x = positions[2].x = 0;
    positions[1].x = positions[3].x = 128;
    positions[0].y = positions[1].y = 0;
    positions[2].y = positions[3].y = 128;

    this._materials = new Array(2);
    for (let i = 0; i < 2; ++i) {
      this._materials[i] = new SpriteMaterial();
    }

    this._setUpRenderData = new _RenderData(this, 0);
    this._clearRenderData = new _RenderData(this, 1);
  }

  set width(val) {
    let positions = this._positions;
    positions[1].x = positions[3].x = val;
  }

  set height(val) {
    let positions = this._positions;
    positions[2].y = positions[3].y = val;
  }
}