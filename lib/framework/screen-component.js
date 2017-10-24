import { Component } from 'ecs.js';
import renderer from 'renderer.js';

export default class ScreenComponent extends Component {
  constructor() {
    super();

    this._width = 960;
    this._height = 640;

    this._view = new renderer.View();
    this._view._clearFlags = 0;
    this._view._stages = ['2d'];
  }

}