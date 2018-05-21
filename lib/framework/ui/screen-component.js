import WidgetComponent from './widget-component';
import renderer from '../../renderer';

export default class ScreenComponent extends WidgetComponent {
  constructor() {
    super();

    this._view = new renderer.View();
  }

  onInit() {

    this._view._clearFlags = renderer.CLEAR_DEPTH | renderer.CLEAR_STENCIL;
    this._view._cullingByID = true;
    this._view._stages = ['ui'];
    this._view._stencil = 0;
    this._view._priority = this._priority;
    this._system.addScreen(this);
  }

  onDestroy() {
    this._system.removeScreen(this);
  }
}

ScreenComponent.schema = {
  priority: {
    type: 'number',
    default: 0,
    set(val) {
      if (this._priority === val) {
        return;
      }

      this._priority = val;
      this._view._priority = val;
    }
  },

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