import { Component } from 'ecs.js';
import { vec2, vec3, color4, mat4 } from 'vmath';

let _m4_tmp = mat4.create();

function _reallocVertexData(textCount) {
  let vertexCount = 4 * textCount;
  let indexCount = 6 * textCount;

  let indices = new Array(indexCount);
  let lposList = new Array(vertexCount);
  let wposList = new Array(vertexCount);
  let uvs = new Array(vertexCount);
  let color = color4.new();

  for (let i = 0; i < vertexCount; ++i) {
    wposList[i] = vec3.create();
    lposList[i] = vec3.create();
    uvs[i] = vec2.create();
  }

  for (let i = 0; i < textCount; ++i) {
    indices[6 * i + 0] = 4 * i + 0;
    indices[6 * i + 1] = 4 * i + 1;
    indices[6 * i + 2] = 4 * i + 2;
    indices[6 * i + 3] = 4 * i + 3;
    indices[6 * i + 4] = 4 * i + 2;
    indices[6 * i + 5] = 4 * i + 1;
  }

  return {
    wposList,
    lposList,
    uvs,
    color,
    indices,
  };
}

function _genFontVerts(
  out,
  text,
  font,
  alignH,
  alignV,
  wrap,
  fontSize,
  lineHeight,
  x, y, w, h
) {
  let cursorY = 0;
  let paragraphs = text.split('\n');
  let fontScale = fontSize / font._size;
  let totalLines = 0;
  let totalChars = 0;

  function _fillLine(para, start, end) {
    let cursorX = 0;
    for (let i = 0; i < end - start; ++i) {
      let charCode = para.charCodeAt(i + start);
      let glyph = font._glyphs[charCode] || font._defaultGlyph;
      let x0 = cursorX + glyph.xoffset * fontScale;
      let x1 = cursorX + (glyph.width + glyph.xoffset) * fontScale;
      let y0 = cursorY - (glyph.height + glyph.yoffset) * fontScale;
      let y1 = cursorY - glyph.yoffset * fontScale;

      let idx = totalChars + i;

      vec3.set(out.lposList[4 * idx + 0], x0, y0, 0);
      vec3.set(out.lposList[4 * idx + 1], x1, y0, 0);
      vec3.set(out.lposList[4 * idx + 2], x0, y1, 0);
      vec3.set(out.lposList[4 * idx + 3], x1, y1, 0);

      vec2.copy(out.uvs[4 * idx + 0], glyph.uvs[0]);
      vec2.copy(out.uvs[4 * idx + 1], glyph.uvs[1]);
      vec2.copy(out.uvs[4 * idx + 2], glyph.uvs[2]);
      vec2.copy(out.uvs[4 * idx + 3], glyph.uvs[3]);

      cursorX += glyph.xadvance * fontScale;
    }

    // process alignH
    if (cursorX < w) {
      for (let i = 0; i < end - start; ++i) {
        let offsetX = (w - cursorX) * alignH;
        let idx = totalChars + i;

        out.lposList[4 * idx + 0].x += offsetX;
        out.lposList[4 * idx + 1].x += offsetX;
        out.lposList[4 * idx + 2].x += offsetX;
        out.lposList[4 * idx + 3].x += offsetX;
      }
    }

    totalChars += end - start;
    ++totalLines;
    cursorY -= lineHeight * font._lineHeight * fontScale;
  }

  if (wrap) {
    for (let i = 0; i < paragraphs.length; ++i) {
      let wrapInfos = font.getWrappedInfos(paragraphs[i], fontSize, lineHeight, w);
      for (let j = 0; j < wrapInfos.length; ++j) {
        _fillLine(paragraphs[i], wrapInfos[j].start, wrapInfos[j].end);
      }
    }
  } else {
    for (let i = 0; i < paragraphs.length; ++i) {
      _fillLine(paragraphs[i], 0, paragraphs[i].length);
    }
  }

  // process alignV and move it to [0,0, width, height] rect
  let labelHeight = totalLines * lineHeight * font._lineHeight * fontScale;
  let alignVOffset = labelHeight < h ? (h - labelHeight) * -alignV : 0.0;
  let offsetY = y + h + alignVOffset;

  for (let i = 0; i < totalChars; ++i) {
    out.lposList[4 * i + 0].x += x;
    out.lposList[4 * i + 1].x += x;
    out.lposList[4 * i + 2].x += x;
    out.lposList[4 * i + 3].x += x;

    out.lposList[4 * i + 0].y += offsetY;
    out.lposList[4 * i + 1].y += offsetY;
    out.lposList[4 * i + 2].y += offsetY;
    out.lposList[4 * i + 3].y += offsetY;
  }
  return totalChars;
}

export default class TextComponent extends Component {
  constructor() {
    super();

    this._material = null;
    this._font = null;
    this._text = '';
    this._align = 'top-left';
    this._wrap = true;
    this._fontSize = 32;
    this._lineHeight = 1.0;
    this._color = color4.create();

    this._alignH = 0.0;
    this._alignV = 0.0;
    this._cachedVertexData = _reallocVertexData(this._text.length);
    this._vertexDataDirty = false;
  }

  onInit() {
    this._entity.on('widget-rect-changed', this._onRectChanged);

    if (this._material === null) {
      this._material = this._engine.assets.get('builtin-material-sprite');
    }
  }

  onDestroy() {
    this._entity.off('widget-rect-changed', this._onRectChanged);
  }

  _onRectChanged() {
    this._vertexDataDirty = true;
  }

  get material() {
    return this._material;
  }
  set material(val) {
    if (val !== this._material) {
      this._material = val;
    }
  }

  get font() {
    return this._font;
  }
  set font(val) {
    if (val !== this._font) {
      this._font = val;
      this._vertexDataDirty = true;
    }
  }

  get text() {
    return this._text;
  }
  set text(val) {
    this._text = val;

    if (this._font.type === 'opentype') {
      this._font.addText(this._text);
    }

    this._cachedVertexData = _reallocVertexData(this._text.length);
    this._vertexDataDirty = true;
  }

  get color() {
    return this._color;
  }
  set color(val) {
    color4.copy(this._color, val);
  }

  get wrap() {
    return this._wrap;
  }
  set wrap(val) {
    if (this._wrap !== val) {
      this._wrap = val;
      this._vertexDataDirty = true;
    }
  }

  get fontSize() {
    return this._fontSize;
  }
  set fontSize(val) {
    if (this._fontSize !== val) {
      this._fontSize = val;
      this._vertexDataDirty = true;
    }
  }

  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(val) {
    if (this._lineHeight !== val) {
      this._lineHeight = val;
      this._vertexDataDirty = true;
    }
  }

  get align() {
    return this._align;
  }
  set align(val) {
    if (this._align !== val) {
      this._align = val;

      if (val === 'top-left') {
        this._alignH = 0.0;
        this._alignV = 0.0;
      } else if (val === 'top-center') {
        this._alignH = 0.5;
        this._alignV = 0.0;
      } else if (val === 'top-right') {
        this._alignH = 1.0;
        this._alignV = 0.0;
      } else if (val === 'middle-left') {
        this._alignH = 0.0;
        this._alignV = 0.5;
      } else if (val === 'middle-center') {
        this._alignH = 0.5;
        this._alignV = 0.5;
      } else if (val === 'middle-right') {
        this._alignH = 1.0;
        this._alignV = 0.5;
      } else if (val === 'bottom-left') {
        this._alignH = 0.0;
        this._alignV = 1.0;
      } else if (val === 'bottom-center') {
        this._alignH = 0.5;
        this._alignV = 1.0;
      } else if (val === 'bottom-right') {
        this._alignH = 1.0;
        this._alignV = 1.0;
      }

      this._vertexDataDirty = true;
    }
  }

  calcVertexData(x, y, w, h) {
    if (this._vertexDataDirty) {
      this._vertexDataDirty = false;

      color4.copy(this._cachedVertexData.color, this._color);

      _genFontVerts(
        this._cachedVertexData,
        this._text,
        this._font,
        this._alignH,
        this._alignV,
        this._wrap,
        this._fontSize,
        this._lineHeight,
        x, y, w, h
      );
    }

    this._entity.getWorldMatrix(_m4_tmp);

    for (let i = 0; i < this._cachedVertexData.lposList.length; ++i) {
      let lpos = this._cachedVertexData.lposList[i];
      let wpos = this._cachedVertexData.wposList[i];

      vec3.transformMat4(wpos, lpos, _m4_tmp);
    }

    return this._cachedVertexData;
  }
}