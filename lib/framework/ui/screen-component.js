import WidgetComponent from './widget-component';
import renderer from '../../renderer';

export default class ScreenComponent extends WidgetComponent {
  onInit() {
    this._view = new renderer.View();
    this._view._clearFlags = renderer.CLEAR_DEPTH | renderer.CLEAR_STENCIL;
    this._view._cullingByID = true;
    this._view._stages = ['ui'];

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