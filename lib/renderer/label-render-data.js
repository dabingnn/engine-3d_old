
import renderer from 'renderer.js';
import { color4, vec2, vec3, mat4 } from 'vmath';
import enums from '../enums';

const _defaultWidth = 64;
const _defaultHeight = 64;
const _maxCharsInLabel = 2048;
let _labelIndices = new Uint16Array(_maxCharsInLabel * 6);
for (let i = 0; i < _maxCharsInLabel; ++i) {
  _labelIndices[6 * i + 0] = 4 * i + 0;
  _labelIndices[6 * i + 1] = 4 * i + 1;
  _labelIndices[6 * i + 2] = 4 * i + 2;
  _labelIndices[6 * i + 3] = 4 * i + 3;
  _labelIndices[6 * i + 4] = 4 * i + 2;
  _labelIndices[6 * i + 5] = 4 * i + 1;
}

export default class LabelRenderData {
  constructor() {
    this._width = _defaultWidth;
    this._height = _defaultHeight;
    this._node = null;
    this._effect = null;
    this._font = null;
    this._label = '';
    this._texture = null;
    let positions = [];
    let uvs = [];
    for (let i = 0; i < 4 * 256; ++i) {
      positions.push(vec3.create());
      uvs.push(vec3.create());
    }

    this._positions = positions;
    this._uvs = uvs;
    this._vertexDataDirty = true;

    this._horizontalAlignPercentage = 0.0;
    this._verticalAlignPercentage = 0.0;
    this._horizontalAlign = enums.TEXT_ALIGN_LEFT;
    this._verticalAlign = enums.TEXT_ALIGN_TOP;
    this._wrap = true;
    this._fontSize = 32;
    this._lineHeight = 1.0;
    this._indices = _labelIndices;
    this._vertexCount = 0;
    this._indexCount = 0;

  }

  destroy() {
  }

  setNode(node) {
    this._node = node;
  }

  setEffect(effect) {
    this._effect = effect;
  }

  set label(val) {
    this._label = val;
    this._vertexDataDirty = true;
  }

  set width(val) {
    this._width = val;
    this._vertexDataDirty = true;
  }

  set height(val) {
    this._height = val;
    this._vertexDataDirty = true;
  }

  set font(val) {
    this._font = val;
    this._texture = val._texture;
    this._vertexDataDirty = true;
  }

  set wrap(val) {
    if (this._wrap !== val) {
      this._wrap = val;
      this._vertexDataDirty = true;
    }
  }

  set fontSize(val) {
    if (this._fontSize !== val) {
      this._fontSize = val;
      this._vertexDataDirty = true;
    }
  }

  set lineHeight(val) {
    if (this._lineHeight !== val) {
      this._lineHeight = val;
      this._vertexDataDirty = true;
    }
  }

  set horizontalAlign(val) {
    let percentage = 0.0;
    if (val === enums.TEXT_ALIGN_CENTER) {
      percentage = 0.5;
    } else if (val === enums.TEXT_ALIGN_RIGHT) {
      percentage = 1.0;
    } else {
      // do nothing 0.0 is default value
    }
    if (percentage !== this._horizontalAlignPercentage) {
      this._horizontalAlignPercentage = percentage;
      this._vertexDataDirty = true;
    }
  }

  set verticalAlign(val) {
    let percentage = 0.0;
    if (val === enums.TEXT_ALIGN_CENTER) {
      percentage = 0.5;
    } else if (val === enums.TEXT_ALIGN_BOTTOM) {
      percentage = 1.0;
    } else {
      // do nothing 0.0 is default value
    }
    if (percentage !== this._verticalAlignPercentage) {
      this._verticalAlignPercentage = percentage;
      this._vertexDataDirty = true;
    }
  }

  get vertexCount() {
    return this._vertexCount;
  }

  get indexCount() {
    return this._indexCount;
  }

  get positions() {
    return this._positions;
  }

  get uvs() {
    return this._uvs;
  }

  updateModelData() {
    if (this._vertexDataDirty && this._font) {
      this._vertexDataDirty = false;
      let filledChars = this._font.genTextVertices(this, this._label, this._horizontalAlignPercentage, this._verticalAlignPercentage,
        this._wrap, this._width, this._height, this._fontSize, this._lineHeight);
      this._vertexCount = filledChars * 4;
      this._indexCount = filledChars * 6;
    }
  }

}