import Asset from './asset';
import { color4, vec2, vec3, mat4 } from 'vmath';

export default class BMFont extends Asset {
  constructor() {
    super();

    this._texture = null;
    this._rawJson = null;

    this._rawLineHeight = 32;
    this._rawFontSize = 32;
    this._characters = {};
  }

  get faceName() {
    return this._rawJson ? '' : this._rawJson.info.face;
  }


  commit() {
    // reset characters data
    this._characters = {};
    let textureWidth = this._texture ? this._texture._texture._width : 64;
    let textureHeight = this._texture ? this._texture._texture._height : 64;
    let json = this._rawJson;
    this._rawLineHeight = json.common.lineHeight;
    this._rawFontSize = json.info.size;
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
      let rawInfo = json.chars[charCode];
      let u0 = rawInfo.x / textureWidth;
      let u1 = (rawInfo.x + rawInfo.width) / textureWidth;
      let v0 = 1.0 - (rawInfo.y + rawInfo.height) / textureHeight;
      let v1 = 1.0 - rawInfo.y / textureHeight;
      this._characters[charCode] = {
        char: String.fromCharCode(charCode),
        x: rawInfo.x,
        y: rawInfo.y,
        width: rawInfo.width,
        height: rawInfo.height,
        xoffset: rawInfo.xoffset,
        yoffset: rawInfo.yoffset,
        xadvance: rawInfo.xadvance
      };
      this._characters[charCode].uvs = [vec3.new(u0, v0, 0), vec3.new(u1, v0, 0), vec3.new(u0, v1, 0), vec3.new(u1, v1, 0)];
    }
  }
}