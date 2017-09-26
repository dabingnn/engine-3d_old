import { Component } from 'ecs.js';
import ScreenModel from '../renderer/screen-model';
// import renderer from 'renderer.js';
// import { color3, toRadian, toDegree } from 'vmath';

export default class ScreenComponent extends Component {
  constructor() {
    super();
    this._width = 960;
    this._height = 640;
    this._model = null;
  }

  onInit() {
    this._model = new ScreenModel();
  }

}