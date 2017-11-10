import { Component } from 'ecs.js';
import LabelRenderHelper from '../renderer/label-render-data';
import SpriteMaterial from '../materials/sprite-material';
import { color4 } from 'vmath';
import enums from '../enums';

export default class LabelComponent extends Component {
  constructor() {
    super();
    this._label = '';
    this._renderHelper = new LabelRenderHelper();
    this._width = this._renderHelper._width;
    this._height = this._renderHelper._height;
    this._material = new SpriteMaterial();
    this._font = null;
    this._horizontalAlign = enums.TEXT_ALIGN_LEFT;
    this._verticalAlign = enums.TEXT_ALIGN_TOP;
    this._wrap = true;
    this._fontSize = 32;
    this._lineHeight = 1.0;
    this._color = color4.create();
  }

  onInit() {
    this._renderHelper.setNode(this._entity);
    this._renderHelper.setEffect(this._material._effect);
  }

  set font(val) {
    this._font = val;
    this._material.mainTexture = val._texture;
    this._renderHelper.font = val;
  }

  set label(val) {
    this._label = val;
    this._renderHelper.label = val;
  }

  set color(val) {
    color4.copy(this._color, val);
    this._renderHelper.color = val;
  }

  set width(val) {
    this._width = val;
    this._renderHelper.width = val;
  }

  set height(val) {
    this._height = val;
    this._renderHelper.height = val;
  }

  set wrap(val) {
    this._wrap = val;
    this._renderHelper.wrap = val;
  }

  set fontSize(val) {
    this._fontSize = val;
    this._renderHelper.fontSize = val;
  }

  set lineHeight(val) {
    this._lineHeight = val;
    this._renderHelper.lineHeight = val;
  }

  set horizontalAlign(val) {
    this._horizontalAlign = val;
    this._renderHelper.horizontalAlign = val;
  }

  set verticalAlign(val) {
    this._verticalAlign = val;
    this._renderHelper.verticalAlign = val;
  }

  destroy() {
    this._renderHelper.destroy();
  }
}