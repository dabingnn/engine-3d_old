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

  set type(val) {
    this._light.type = val;
  }
  get type() {
    return this._light.type;
  }

  set color(val) {
    this._light.color = val;
  }
  get color() {
    return this._light.color;
  }

  set intensity(val) {
    this._light.intensity = val;
  }
  get intensity() {
    return this._light.intensity;
  }

  set range(val) {
    this._light.range = val;
  }
  get range() {
    return this._light.range;
  }

  set spotAngle(val) {
    this._light.spotAngle = toRadian(val);
  }
  get spotAngle() {
    return toDegree(this._light.spotAngle);
  }

  set spotExp(val) {
    this._light.spotExp = val;
  }
  get spotExp() {
    return this._light.spotExp;
  }

  set castShadow(val) {
    this._light.castShadow = val;
  }
  get castShadow() {
    return this._light.castShadow;
  }

  set shadowType(val) {
    this._light.shadowType = val;
  }
  get shadowType() {
    return this._light.shadowType;
  }

  set shadowResolution(val) {
    this._light._shadowResolution = val;
  }
  get shadowResolution() {
    return this._light._shadowResolution;
  }

  set shadowDarkness(val) {
    this._light.shadowDarkness = val;
  }
  get shadowDarkness() {
    return this._light.shadowDarkness;
  }

  set shadowMinDepth(val) {
    this._light.shadowMinDepth = val;
  }
  get shadowMinDepth() {
    return this._light.shadowMinDepth;
  }

  set shadowMaxDepth(val) {
    this._light.shadowMaxDepth = val;
  }
  get shadowMaxDepth() {
    return this._light.shadowMaxDepth;
  }

  set shadowDepthScale(val) {
    this._light.shadowDepthScale = val;
  }
  get shadowDepthScale() {
    return this._light.shadowDepthScale;
  }
}