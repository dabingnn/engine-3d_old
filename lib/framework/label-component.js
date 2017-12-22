import { Component } from 'ecs.js';
import LabelRenderHelper from '../renderer/label-render-data';
import { color4 } from 'vmath';
import enums from '../enums';
import Material from '../assets/material';

export default class LabelComponent extends Component {
  constructor() {
    super();
    this._label = '';
    this._renderHelper = new LabelRenderHelper();
    this._material = null;
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
    // HACK, TODO
    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._engine.assets.get('builtin-sprite');
    }
  }

  set material(val) {
    this._material = val;
    this._renderHelper.setEffect(val.effectInst);
  }

  set font(val) {
    this._font = val;
    this._material.setProperty('mainTexture', val);
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