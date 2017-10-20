
import renderer from 'renderer.js';
import { color4, vec2, vec3, mat4 } from 'vmath';

const _defaultWidth = 64;
const _defaultHeight = 64;
let _labelIndices = new Uint16Array(8196);
for (let i = 0; i < 8196 / 6; ++i) {
  _labelIndices[6 * i + 0] = 4 * i + 0;
  _labelIndices[6 * i + 1] = 4 * i + 1;
  _labelIndices[6 * i + 2] = 4 * i + 2;
  _labelIndices[6 * i + 3] = 4 * i + 3;
  _labelIndices[6 * i + 4] = 4 * i + 2;
  _labelIndices[6 * i + 5] = 4 * i + 1;
}

export default class LabelModel extends renderer.Model {
  constructor() {
    super();
    this._dynamicIA = true;
    this._modelData = null;
    this._sortKey = 0;
    this._width = _defaultWidth;
    this._height = _defaultHeight;
    this._font = null;
    this._label = '';
    let positions = [];
    let uvs = [];
    for (let i = 0; i < 4 * 64; ++i) {
      positions.push(vec3.create());
      uvs.push(vec3.create());
    }

    this._modelData = { positions, uvs, indices: _labelIndices, vertexCount: 0, indexCount: 0 };
    this._modelDataDirty = true;
    // this._sprite = null;
    // this.type = enums.SPRITE_SIMPLE;
  }

  destroy() {
    // _freeModelData(this._type, this._modelData);
    // this._modelData = null;
  }

  set sortKey(val) {
    this._sortKey = val;
  }

  get sortKey() {
    return this._sortKey;
  }

  set label(val) {
    this._label = val;
    this._modelDataDirty = true;
  }

  // set type(val) {
  //   if (this._type !== val) {
  //     _freeModelData(this._type, this._modelData);
  //     this._type = val;
  //     this._modelData = _allocModelData(this._type);
  //   }
  // }

  set width(val) {
    this._width = val;
  }

  set height(val) {
    this._height = val;
  }

  set font(val) {
    this._font = val;
    this._modelDataDirty = true;
  }

  updateModelData() {
    if (this._modelDataDirty || true) {
      this._modelDataDirty = false;
      let positions = this._modelData.positions;
      let uvs = this._modelData.uvs;
      let width = this._width;
      let height = this._height;
      let renderedCharCount = 0;
      let cursorX = 0;
      let cursorY = 0;
      let font = this._font;
      for (let i = 0; i < this._label.length; ++i) {
        let charCode = this._label.charCodeAt(i);
        let charInfo = font && font._characters[charCode];

        // not space and char exsist
        if (charInfo) {
          let x0 = cursorX + charInfo.xoffset;
          let x1 = cursorX + charInfo.width + charInfo.xoffset;
          let y0 = cursorY - charInfo.height - charInfo.yoffset;
          let y1 = cursorY - charInfo.yoffset;
          vec3.set(positions[4 * i + 0], x0, y0, 0);
          vec3.set(positions[4 * i + 1], x1, y0, 0);
          vec3.set(positions[4 * i + 2], x0, y1, 0);
          vec3.set(positions[4 * i + 3], x1, y1, 0);

          vec3.copy(uvs[4 * i + 0], charInfo.uvs[0]);
          vec3.copy(uvs[4 * i + 1], charInfo.uvs[1]);
          vec3.copy(uvs[4 * i + 2], charInfo.uvs[2]);
          vec3.copy(uvs[4 * i + 3], charInfo.uvs[3]);
          cursorX += charInfo.xadvance;
          renderedCharCount++;
        }

      }

      this._modelData.vertexCount = renderedCharCount * 4;
      this._modelData.indexCount = renderedCharCount * 6;
    }
  }

}