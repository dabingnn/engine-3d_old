import Font from './font';
import Texture2D from '../assets/texture-2d';

// System Font Rendered by Canvas
export default class SystemFont extends Font {
  constructor(device) {
    super();

    this._texture = new Texture2D(device);
    this._canvas = document.createElement('canvas');
    this._type = 'system';
  }

  get type() {
    return this._type;
  }

  get canvas() {
    return this._canvas;
  }

  get texture() {
    return this._texture;
  }
  set texture(val) {
    this._texture = val;
  }

}