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
}