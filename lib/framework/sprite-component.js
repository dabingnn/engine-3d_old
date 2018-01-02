import { Component } from 'ecs.js';
import { vec3, color4 } from 'vmath';

import enums from '../enums';
import Material from '../assets/material';

function _reallocVertexData(type) {
  let vertexCount = 4;

  if (type === enums.SPRITE_SIMPLE) {
    vertexCount = 4;
  } else if (type === enums.SPRITE_SLICED) {
    vertexCount = 16;
  }

  let positions = new Array(vertexCount);
  let uvs = new Array(vertexCount);

  for (let i = 0; i < vertexCount; ++i) {
    positions[i] = vec3.create();
    uvs[i] = vec3.create();
  }

  return {
    positions,
    uvs
  };
}

export default class SpriteComponent extends Component {
  constructor() {
    super();

    this._material = null;
    this._type = enums.SPRITE_SIMPLE;
    this._sprite = null;
    this._color = color4.create();

    this._dirty = false;
    this._cachedVertexData = _reallocVertexData(this._type);
  }

  onInit() {
    // TODO: HACK
    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._engine.assets.get('builtin-sprite');
    }
  }

  get material () {
    return this._material;
  }
  set material(val) {
    if (val !== this._material) {
      this._material = val;
      this._dirty = true;
    }
  }

  get type() {
    return this._type;
  }
  set type(val) {
    if (val !== this._type) {
      this._type = val;
      this._dirty = true;

      this._cachedVertexData = _reallocVertexData(this._type);
    }
  }

  get sprite () {
    return this._sprite;
  }
  set sprite(val) {
    if (val !== this._sprite) {
      this._sprite = val;
      // TODO: HACK
      this._material.setProperty('mainTexture', val._texture);
      this._dirty = true;
    }
  }

  get color () {
    return this._color;
  }
  set color(val) {
    color4.copy(this._color, val);
  }
}