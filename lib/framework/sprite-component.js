import { Component } from 'ecs.js';
import enums from '../enums';
import SpriteMaterial from '../materials/sprite-material';
import SpriteRenderData from '../renderer/sprite-render-data';
import { color4 } from 'vmath';

export default class SpriteComponent extends Component {
  constructor() {
    super();

    this._material = new SpriteMaterial();
    this._material.color = color4.create();
    this._type = enums.SPRITE_SIMPLE;
    this._model = new SpriteRenderData(this);
    this._width = this._model._width;
    this._height = this._model._height;
    this._sprite = null;
  }

  onInit() {
    // this._model.setNode(this._entity);
    // this._model.addEffect(this._material._effect);
  }

  set type(val) {
    this._type = val;
    this._model.type = val;
  }

  set sprite(val) {
    this._sprite = val;
    this._material.mainTexture = val._texture;
    this._model.sprite = val;
  }

  set color(val) {
    this._material.color = val;
  }

  set width(val) {
    this._width = val;
    this._model.width = val;
  }

  set height(val) {
    this._height = val;
    this._model.height = val;
  }

  destroy() {
    this._model.destroy();
  }
}