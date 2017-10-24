import Asset from './asset';
import { color4, vec2, vec3, mat4 } from 'vmath';

export default class BMFont extends Asset {
  constructor() {
    super();

    this._texture = null;
    this._json = null;

    this._lineHeight = 32;
    this._fontSize = 32;
    this._characters = {};
  }

  get faceName() {
    return this._json ? '' : this._json.info.face;
  }

  commit() {
    // reset characters data
    this._characters = {};
    let textureWidth = this._texture ? this._texture._texture._width : 64;
    let textureHeight = this._texture ? this._texture._texture._height : 64;
    let json = this._json;
    this._lineHeight = json.common.lineHeight;
    this._fontSize = json.info.size;
    // todo add kernings here
    // json.kernings.forEach(kerning => {
    //   font._kernings[kerning.first] = font._kernings[kerning.first] || {};
    //   font._kernings[kerning.first][kerning.second] = kerning.amount;
    // });
    /**
     * v2------v3
     * |       |
     * |       |
     * |       |
     * v0      v1
     */
    for (let charCode in json.chars) {
      let charInfo = json.chars[charCode];
      let u0 = charInfo.x / textureWidth;
      let u1 = (charInfo.x + charInfo.width) / textureWidth;
      let v0 = 1.0 - (charInfo.y + charInfo.height) / textureHeight;
      let v1 = 1.0 - charInfo.y / textureHeight;
      this._characters[charCode] = {
        char: String.fromCharCode(charCode),
        x: charInfo.x,
        y: charInfo.y,
        width: charInfo.width,
        height: charInfo.height,
        xoffset: charInfo.xoffset,
        yoffset: charInfo.yoffset,
        xadvance: charInfo.xadvance
      };
      this._characters[charCode].uvs = [vec3.new(u0, v0, 0), vec3.new(u1, v0, 0), vec3.new(u0, v1, 0), vec3.new(u1, v1, 0)];
    }
  }
}