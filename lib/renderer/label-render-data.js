
import renderer from 'renderer.js';
import { color4, vec2, vec3, mat4 } from 'vmath';
import enums from '../enums';

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

export default class LabelRenderData {
  constructor(comp) {
    this._modelData = null;
    this._width = _defaultWidth;
    this._height = _defaultHeight;
    this._component = comp;
    this._font = null;
    this._label = '';
    this._texture = null;
    let positions = [];
    let uvs = [];
    for (let i = 0; i < 4 * 256; ++i) {
      positions.push(vec3.create());
      uvs.push(vec3.create());
    }

    this._modelData = { positions, uvs, indices: _labelIndices, vertexCount: 0, indexCount: 0 };
    this._modelDataDirty = true;

    this._horizontalAlignPercentage = 0.0;
    this._verticalAlignPercentage = 0.0;
    this._horizontalAlign = enums.TEXT_ALIGN_LEFT;
    this._verticalAlign = enums.TEXT_ALIGN_TOP;
    this._wrap = true;
    this._fontSize = 32;
    this._lineHeight = 1.0;
  }

  destroy() {
  }

  set label(val) {
    this._label = val;
    this._modelDataDirty = true;
  }

  set width(val) {
    this._width = val;
    this._modelDataDirty = true;
  }

  set height(val) {
    this._height = val;
    this._modelDataDirty = true;
  }

  set font(val) {
    this._font = val;
    this._texture = val._texture;
    this._modelDataDirty = true;
  }

  set wrap(val) {
    if (this._wrap !== val) {
      this._wrap = val;
      this._modelDataDirty = true;
    }
  }

  set fontSize(val) {
    if (this._fontSize !== val) {
      this._fontSize = val;
      this._modelDataDirty = true;
    }
  }

  set lineHeight(val) {
    if (this._lineHeight !== val) {
      this._lineHeight = val;
      this._modelDataDirty = true;
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
      this._modelDataDirty = true;
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
      this._modelDataDirty = true;
    }
  }

  updateModelData() {
    if (this._modelDataDirty || true) {
      this._modelDataDirty = false;
      this._font && this._font.genTextVertices(this._modelData, this._label, this._horizontalAlignPercentage, this._verticalAlignPercentage,
        this._wrap, this._width, this._height, this._fontSize, this._lineHeight);
    }
  }

}