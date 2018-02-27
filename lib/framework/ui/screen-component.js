import WidgetComponent from './widget-component';
import renderer from 'renderer.js';

export default class ScreenComponent extends WidgetComponent {
  constructor() {
    super();

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
}

ScreenComponent.schema = {
  width: {
    type: 'number',
    default: 960,
    set(val) {
      this._width = val;
    }
  },

  height: {
    type: 'number',
    default: 640,
    set(val) {
      this._height = val;
    }
  }
};