import Font from './font';
import { vec2 } from 'vmath';

export default class BMFont extends Font {
  constructor() {
    super();

    this._texture = null;
    this._face = '';
    this._defaultGlyph = {
      char: ' ',
      x: 0,
      y: 0,
      width: 32,
      height: 32,
      xoffset: 0,
      yoffset: 0,
      xadvance: 32,
      uvs: [
        vec2.new(0, 0),
        vec2.new(0, 0),
        vec2.new(0, 0),
        vec2.new(0, 0)
      ],
    };
    this._type = 'bitmap';
  }

  get texture() {
    return this._texture;
  }

  get face() {
    return this._face;
  }

}