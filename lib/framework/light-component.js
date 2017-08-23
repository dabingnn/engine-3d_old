import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { color3 } from 'vmath';

export default class LightComponent extends Component {
  constructor() {
    super();

    this._light = new renderer.Light();
  }

  onInit() {
    this._light.setNode(this._entity);
  }

  setColor(r, g, b) {
    color3.set(this._light.color, r, g, b);
  }

  getColor(out) {
    const clr = this._light.color;

    if (out) {
      color3.copy(out, clr);
      return out;
    }

    return color3.new(clr.r, clr.g, clr.b);
  }
}