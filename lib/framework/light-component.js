import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { toRadian, toDegree } from 'vmath';

export default class LightComponent extends Component {
  constructor() {
    super();

    this._light = new renderer.Light();
  }

  onInit() {
    this._light.setNode(this._entity);
  }

  onEnable() {
    this._entity.emit('light-changed', this, 'enabled', true);
  }

  onDisable() {
    this._entity.emit('light-changed', this, 'enabled', false);
  }

  set type(val) {
    this._light.setType(val);
  }
  get type() {
    return this._light.type;
  }

  set color(val) {
    this._light.setColor(val.r, val.g, val.b);
  }
  get color() {
    return this._light.color;
  }

  set intensity(val) {
    this._light.setIntensity(val);
  }
  get intensity() {
    return this._light.intensity;
  }

  set range(val) {
    this._light.setRange(val);
  }
  get range() {
    return this._light.range;
  }

  set spotAngle(val) {
    this._light.setSpotAngle(toRadian(val));
  }
  get spotAngle() {
    return toDegree(this._light.spotAngle);
  }

  set spotExp(val) {
    this._light.setSpotExp(val);
  }
  get spotExp() {
    return this._light.spotExp;
  }

  set shadowType(val) {
    this._light.setShadowType(val);
  }
  get shadowType() {
    return this._light.shadowType;
  }

  set shadowResolution(val) {
    this._light.setShadowResolution(val);
  }
  get shadowResolution() {
    return this._light._shadowResolution;
  }

  set shadowDarkness(val) {
    this._light.setShadowDarkness(val);
  }
  get shadowDarkness() {
    return this._light.shadowDarkness;
  }

  set shadowMinDepth(val) {
    this._light.setShadowMinDepth(val);
  }
  get shadowMinDepth() {
    return this._light.shadowMinDepth;
  }

  set shadowMaxDepth(val) {
    this._light.setShadowMaxDepth(val);
  }
  get shadowMaxDepth() {
    return this._light.shadowMaxDepth;
  }

  set shadowDepthScale(val) {
    this._light.setShadowDepthScale(val);
  }
  get shadowDepthScale() {
    return this._light.shadowDepthScale;
  }
}