import Asset from './asset';

export default class Font extends Asset {
  constructor() {
    super();

    this._size = 64; // font size
    this._type = 'unknow'; // font type: bitmap or opentype
    this._glyphs = {}; // glyph : {char, x, y, width, height, xoffset, yoffset, xadvance}
    // this._textureAtlas = null;
    this._lineHeight = 32;
    this._useKerning = false;
  }

  get size() {
    return this._size;
  }

  get lineHeight() {
    return this._lineHeight;
  }

}