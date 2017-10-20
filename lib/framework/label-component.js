import { Component } from 'ecs.js';
import LabelModel from '../renderer/label-model';
import SpriteMaterial from '../materials/sprite-material';
import { color4 } from 'vmath';

export default class LabelComponent extends Component {
  constructor() {
    super();
    this._label = '';
    this._model = new LabelModel();
    this._width = this._model._width;
    this._height = this._model._height;
    this._material = new SpriteMaterial();
    this._material.color = color4.create();
    this._font = null;
  }

  onInit() {
    this._model.setNode(this._entity);
    this._model.addEffect(this._material._effect);
  }

  set font(val) {
    this._font = val;
    this._material.mainTexture = val._texture;
    this._model.font = val;
  }

  set label(val) {
    this._label = val;
    this._model.label = val;
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