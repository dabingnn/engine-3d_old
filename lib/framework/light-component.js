import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { color3, toRadian, toDegree } from 'vmath';

export default class LightComponent extends Component {
  constructor() {
    super();

    this._light = new renderer.Light();
  }

  onInit() {
    this._light.setNode(this._entity);
  }

  setType(val) {
    this._light.type = val;
  }

  getType() {
    return this._light.type;
  }

  setColor(r, g, b) {
    color3.set(this._light.color, r, g, b);
  }

  getColor(out) {
    if (out) {
      color3.copy(out, this._light.color);
      return out;
    }
    return color3.new(this._light.color.r, this._light.color.g, this._light.color.b);
  }

  setIntensity(val) {
    this._light.intensity = val;
  }

  getIntensity() {
    return this._light.intensity;
  }

  setRange(val) {
    this._light.range = val;
  }

  getRange() {
    return this._light.range;
  }

  setSpotAngle(val) {
    this._light.spotAngle = toRadian(val);
  }

  getSpotAngle() {
    return toDegree(this._light.spotAngle);
  }

  setSpotExp(val) {
    this._light.spotExp = val;
  }

  getSpotExp() {
    return this._light.spotExp;
  }

  setCastShadow(val) {
    this._light.castShadow = val;
  }

  getCastShadow() {
    return this._light.castShadow;
  }
}