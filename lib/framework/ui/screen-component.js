import WidgetComponent from './widget-component';
import renderer from 'renderer.js';

export default class ScreenComponent extends WidgetComponent {
  constructor() {
    super();

    this._width = 960;
    this._height = 640;

    this._view = new renderer.View();
    this._view._clearFlags = 0;
    this._view._cullingByID = true;
    this._view._stages = ['ui'];
  }

  onInit() {
    this._system.addScreen(this);
  }

  onDestroy() {
    this._system.removeScreen(this);
  }

  get width () {
    return this._width;
  }
  set width(val) {
    this._width = val;
  }

  get height () {
    return this._height;
  }
  set height(val) {
    this._height = val;
  }

}