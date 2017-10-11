import { Component } from 'ecs.js';

export default class ScreenComponent extends Component {
  constructor() {
    super();
    this._width = 960;
    this._height = 640;
  }

}