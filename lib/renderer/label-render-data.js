
import renderer from 'renderer.js';
import { nextPow2, color4, vec2, vec3, mat4 } from 'vmath';
import { Pool } from 'memop';
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
class _LabelVertsPool {
  constructor() {
    let dataPool = this._dataPool = {};
    // init 8, 16, 32, 64, 128, 256 pool
    for (let poolSize = 256; poolSize >= 8; poolSize = poolSize / 2) {
      dataPool[poolSize] = new Pool(() => {
        let data = [];
        for (let i = 0; i < 4 * poolSize; ++i) {
          data.push(vec3.create());
        }
        return data;
      }, 2);
    }

  }

  alloc(charCount) {
    let poolSize = 8;
    if (charCount > 8) {
      poolSize = nextPow2(charCount);
    }
    if (charCount > 256) {
      console.error('can not alloc size bigger than 256 chars');
    }
    return this._dataPool[poolSize].alloc();
  }

  free(data) {
    this._dataPool[data.length].free(data);
  }
}

const _positionsPool = new _LabelVertsPool();
const _uvsPool = new _LabelVertsPool();

export default class LabelRenderData {
  constructor() {
    this._width = _defaultWidth;
    this._height = _defaultHeight;
    this._node = null;
    this._effect = null;
    this._font = null;
    this._label = '';
    this._texture = null;

    this._positions = _positionsPool.alloc(1);
    this._uvs = _uvsPool.alloc(1);
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
    this._color = color4.create();
  }

  destroy() {
    _positionsPool.free(this._positions);
    _uvsPool.free(this._uvs);
  }

  setNode(node) {
    this._node = node;
  }

  setEffect(effect) {
    this._effect = effect;
  }

  set label(val) {
    this._label = val;
    let charCount = val.length;
    if (charCount * 4 > this._positions.length) {
      _positionsPool.free(this._positions);
      _uvsPool.free(this._uvs);
      this._uvs = _uvsPool.alloc(charCount);
      this._positions = _positionsPool.alloc(charCount);
    }
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

  set color(val) {
    color4.copy(this._color, val);
  }

  get color() {
    return this._color;
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