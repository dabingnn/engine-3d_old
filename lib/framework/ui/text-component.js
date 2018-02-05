import WidgetComponent from './widget-component';
import { vec2, vec3, color4, mat4 } from 'vmath';
import Texture2D from '../../assets/texture-2d';

let _m4_tmp = mat4.create();
let _tmpCanvas = document.createElement('canvas'); // tmp canvas for measure text
_tmpCanvas.width = _tmpCanvas.height = 1;

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


// get width of single line text
function _getTextWidth(textComp, ctx, text) {
  let result = 0;
  if (textComp._font === null) { // system font
    result = ctx.measureText(text).width;
  } else {
    let fontScale = textComp._fontSize / textComp._font._size;
    for (let i = 0; i < text.length; ++i) {
      let charCode = text.charCodeAt(i);
      let glyph = textComp._font._glyphs[charCode] || textComp._font._defaultGlyph;
      result += glyph.xadvance * fontScale;
    }
  }

  return result;
}

function _getWrappedInfos(textComp, text, width) {
  let results = [];
  let words = text.split(textComp._wordSep);
  let lastIndex = 0;
  let index = 0;
  let accWordsWidth = 0;

  let ctx = _tmpCanvas.getContext('2d');
  if (textComp._font === null) { // system font
    let fontItalic = textComp._italic ? 'italic' : '';
    let fontBold = textComp._bold ? 'bold' : '';
    let fontStyle = `${fontItalic} ${fontBold} ${textComp._fontSize}px ${textComp._fontFamily}`;
    ctx.font = fontStyle;
  }

  // sep + word pair
  for (let i = 0; i + 1 < words.length;) {
    let sepWidth = _getTextWidth(textComp, ctx, words[i]);
    let wordWidth = _getTextWidth(textComp, ctx, words[i + 1]);
    if (accWordsWidth + sepWidth + wordWidth < width) {
      if (i !== 0 && accWordsWidth === 0) {
        accWordsWidth += wordWidth;
        lastIndex = lastIndex + words[i].length;
        index += words[i].length + words[i + 1].length;
        // test succeed, increment word index
        i += 2;
      } else {
        accWordsWidth += sepWidth + wordWidth;
        index += words[i].length + words[i + 1].length;
        // test succeed, increment word index
        i += 2;
      }
    } else if (accWordsWidth === 0) {
      // force add one word to line to avoid infinite loop
      results.push({
        start: lastIndex + words[i].length,
        end: lastIndex + words[i].length + words[i + 1].length,
        width: wordWidth
      });
      lastIndex = lastIndex + words[i].length + words[i + 1].length;
      index = lastIndex;
      accWordsWidth = 0;
      // test failed, force add one, increment word index
      i += 2;
    } else {
      // test failed, add wrapped info
      results.push({
        start: lastIndex,
        end: index,
        width: accWordsWidth
      });

      lastIndex = index;
      accWordsWidth = 0;
    }
  }

  // add the last line, do not add the last sep
  if (accWordsWidth > 0) {
    results.push({
      start: lastIndex,
      end: index,
      width: accWordsWidth
    });
  }

  return results;
}

function _genSysFontVertsAndUpdateTexture(textComp, x, y, w, h) {
  function _fillLine(cmd) {
    const curText = cmd.text.slice(cmd.start, cmd.end);
    const curWidth = tmpCtx.measureText(curText).width;
    let cursorX = (w - curWidth) * textComp._alignH;
    fontCtx.fillText(curText, cursorX, cmd.y);
  }

  // set verts
  let out = textComp._cachedVertexData;
  vec3.set(out.lposList[0], x, y, 0);
  vec3.set(out.lposList[1], x + w, y, 0);
  vec3.set(out.lposList[2], x, y + h, 0);
  vec3.set(out.lposList[3], x + w, y + h, 0);
  vec2.set(out.uvs[0], 0, 0);
  vec2.set(out.uvs[1], 1, 0);
  vec2.set(out.uvs[2], 0, 1);
  vec2.set(out.uvs[3], 1, 1);

  // prepare font canvas
  textComp._fontCanvas.width = w;
  textComp._fontCanvas.height = h;
  let fontCtx = textComp._fontCanvas.getContext('2d');
  fontCtx.clearRect(0, 0, w, h);
  fontCtx.fillStyle = '#FFFFFF';

  // apply font style
  let fontItalic = textComp._italic ? 'italic' : '';
  let fontBold = textComp._bold ? 'bold' : '';
  let fontStyle = `${fontItalic} ${fontBold} ${textComp._fontSize}px ${textComp._fontFamily}`;
  fontCtx.font = fontStyle;

  // HACK: no good idea to figure out glyph's ascend.
  let startY = textComp._lineHeight * textComp._fontSize * -0.15;
  let cursorY = startY;
  let paragraphs = textComp._text.split('\n');

  const tmpCtx = _tmpCanvas.getContext('2d');
  tmpCtx.font = fontStyle;

  let drawCmd = []; // cache draw command for apply alignV after
  if (textComp._wrap) {
    for (let i = 0; i < paragraphs.length; ++i) {
      let wrapInfos = _getWrappedInfos(textComp, paragraphs[i], w);
      if (wrapInfos.length === 0) { // should not ignore empty line
        cursorY += textComp._lineHeight * textComp._fontSize;
        drawCmd.push({
          text: '',
          start: 0,
          end: 0,
          y: cursorY
        });
      } else {
        for (let j = 0; j < wrapInfos.length; ++j) {
          cursorY += textComp._lineHeight * textComp._fontSize;
          drawCmd.push({
            text: paragraphs[i],
            start: wrapInfos[j].start,
            end: wrapInfos[j].end,
            y: cursorY
          });
        }
      }
    }
  } else {
    for (let i = 0; i < paragraphs.length; ++i) {
      cursorY += textComp._lineHeight * textComp._fontSize;
      drawCmd.push({
        text: paragraphs[i],
        start: 0,
        end: paragraphs[i].length,
        y: cursorY
      });
    }
  }

  let textH = drawCmd[drawCmd.length - 1].y - startY;
  for (let i = 0; i < drawCmd.length; ++i) {
    drawCmd[i].y += (h - textH) * textComp._alignV;
    _fillLine(drawCmd[i]);
  }

  textComp._fontTexture.setImages([textComp._fontCanvas]);
  textComp._fontTexture.commit();
}

function _genFontVerts(textComp, x, y, w, h) {
  let cursorY = 0;
  let paragraphs = textComp._text.split('\n');
  let font = textComp._font;
  let fontScale = textComp._fontSize / font._size;
  let out = textComp._cachedVertexData;
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
        let offsetX = (w - cursorX) * textComp._alignH;
        let idx = totalChars + i;

        out.lposList[4 * idx + 0].x += offsetX;
        out.lposList[4 * idx + 1].x += offsetX;
        out.lposList[4 * idx + 2].x += offsetX;
        out.lposList[4 * idx + 3].x += offsetX;
      }
    }

    totalChars += end - start;
    ++totalLines;
    cursorY -= textComp._lineHeight * font._lineHeight * fontScale;
  }

  if (textComp._wrap) {
    for (let i = 0; i < paragraphs.length; ++i) {
      let wrapInfos = _getWrappedInfos(textComp, paragraphs[i], w);
      if (wrapInfos.length === 0) { // should not ignore empty line when wrapped, draw a space
        _fillLine(' ', 0, 1);
      } else {
        for (let j = 0; j < wrapInfos.length; ++j) {
          _fillLine(paragraphs[i], wrapInfos[j].start, wrapInfos[j].end);
        }
      }
    }
  } else {
    for (let i = 0; i < paragraphs.length; ++i) {
      _fillLine(paragraphs[i], 0, paragraphs[i].length);
    }
  }

  // process alignV and move it to [0,0, width, height] rect
  let labelHeight = totalLines * textComp._lineHeight * font._lineHeight * fontScale;
  let alignVOffset = labelHeight < h ? (h - labelHeight) * -textComp._alignV : 0.0;
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

export default class TextComponent extends WidgetComponent {
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
    this._wordSep = new RegExp(/([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/);

    this._alignH = 0.0;
    this._alignV = 0.0;
    this._cachedVertexData = _reallocVertexData(1);
    this._vertexDataDirty = false;

    // system font properties
    this._fontFamily = 'Arial';
    this._italic = false; // now system font only
    this._bold = false; // now system font only
    this._fontCanvas = document.createElement('canvas');
    this._fontTexture = null;
  }

  onInit() {
    if (this._material === null) {
      this._material = this._app.assets.get('builtin-material-font');
    }
    if (this._font === null && this._fontTexture === null) {
      this._fontTexture = new Texture2D(this._app.device);
      this._fontTexture.mipmap = false; // TODO: should support mipmap?
      this._fontTexture.wrapS = 'clamp';
      this._fontTexture.wrapT = 'clamp';
      this._fontTexture.premultiplyAlpha = true;
    }
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
      if (this._font.type === 'opentype' && this._text !== '') {
        this._font.addText(this._text);
      } else if(this._fontTexture.type ==='bitmap') {
        this._material = this._app.assets.get('builtin-material-sprite');
      }
      this._cachedVertexData = _reallocVertexData(this._text.length);
      this._vertexDataDirty = true;
    }
  }

  get text() {
    return this._text;
  }
  set text(val) {
    if (this._text !== val) {
      this._text = val;
      if (this._font === null) { // system font
        this._cachedVertexData = _reallocVertexData(1);
        this._vertexDataDirty = true;
        return;
      } else if(this._font.type === 'opentype') {
        this._font.addText(this._text);
      }

      this._cachedVertexData = _reallocVertexData(this._text.length);
      this._vertexDataDirty = true;
    }
  }

  get color() {
    return this._color;
  }
  set color(val) {
    color4.copy(this._color, val);
  }

  set wordSep(val) {
    this._wordSep = val;
  }

  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(val) {
    if (this._fontFamily !== val) {
      this._fontFamily = val;
      this._vertexDataDirty = true;
    }
  }

  get italic() {
    return this._italic;
  }
  set italic(val) {
    if (this._italic !== val) {
      this._italic = val;
      this._vertexDataDirty = true;
    }
  }

  get bold() {
    return this._bold;
  }
  set bold(val) {
    if (this._bold !== val) {
      this._bold = val;
      this._vertexDataDirty = true;
    }
  }

  get fontTexture() {
    return this._fontTexture;
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

      if (this._font === null) { // system font
        _genSysFontVertsAndUpdateTexture(this, x, y, w, h);
      } else {
        _genFontVerts(this, x, y, w, h);
      }
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