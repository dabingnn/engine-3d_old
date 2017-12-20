import { Component } from 'ecs.js';
import enums from '../enums';
import SpriteRenderHelper from '../renderer/sprite-render-data';
import { color4 } from 'vmath';

export default class SpriteComponent extends Component {
  constructor() {
    super();

    this._material = null;
    this._type = enums.SPRITE_SIMPLE;
    this._renderHelper = new SpriteRenderHelper();
    this._sprite = null;
    this._color = color4.create();
  }

  onInit() {
    this._renderHelper.setNode(this._entity);
  }

  set material(val) {
    this._material = val;
    this._renderHelper.setEffect(val.effectInst);
  }

  set type(val) {
    this._type = val;
    this._renderHelper.type = val;
  }

  set sprite(val) {
    this._sprite = val;
    this._material.mainTexture = val._texture;
    this._renderHelper.sprite = val;
  }

  set color(val) {
    color4.copy(this._color, val);
    this._renderHelper.color = val;
  }

  destroy() {
    this._renderHelper.destroy();
  }
}