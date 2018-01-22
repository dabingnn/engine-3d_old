import Asset from './asset';
import Texture2D from '../assets/texture';
import { bits } from 'vmath';

let defaultFontStyle = {
  fontFamily: 'Arial',
  fontSize: 26,
  fillStyle: 'black',
  fontStyle: 'normal', // normal, italic or oblique
  fontVariant: 'normal', // normal or small-caps
  fontWeight: 'normal', // normal, bold, bolder, lighter or 100
  align: 'left',
  lineHeight: 30,
  wrap: false,
  wrapWidth: 100,
  breakWord: false,
  padding: 0,
};

let _tmpCanvas = document.createElement('canvas'); // tmp canvas for measure text
_tmpCanvas.width = _tmpCanvas.height = 20;

function _wrapText(text, style) {

}

function _measureText(text, style, fontStr) {
  let ctx = _tmpCanvas.getContext('2d');
  ctx.font = fontStr;
  const wrapedText = style.wrap ? _wrapText(text, style) : text;
  const lines = wrapedText.split(/(?:\r\n|\r|\n)/);
  const lineWidths = new Array(lines.length);
  let rectWidth = 0;

  for (let i = 0; i < lines.length; ++i) {
    lineWidths[i] = ctx.measureText(lines[i]).width;
    rectWidth = Math.max(rectWidth, lineWidths[i]);
  }
  let rectHeight = Math.max(style.lineHeight, style.fontSize) * lines.length;

  return {
    rectWidth,
    rectHeight,
    lines,
    lineWidths,
  };
}

// System Font Rendered by Canvas
export default class SystemFont extends Asset {
  constructor(device, style = defaultFontStyle) {
    super();

    this._style = style;
    this._texture = new Texture2D(device);
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this._text = null;
    this._type = 'system';
  }

  get type() {
    return this._type;
  }

  get texture(){
    return this._texture;
  }

  set text(val) {
    if (this._text !== val) {
      this._text = val;
      this._updateTexture();
    }
  }

  set style(val) {
    if (this._style !== val) {
      this._style.fontFamily = (val.fontFamily !== undefined) ? val.fontFamily : defaultFontStyle.fontFamily;
      this._style.fontSize = (val.fontSize !== undefined) ? val.fontSize : defaultFontStyle.fontSize;
      this._style.fillStyle = (val.fillStyle !== undefined) ? val.fillStyle : defaultFontStyle.fillStyle;
      this._style.fontStyle = (val.fontStyle !== undefined) ? val.fontStyle : defaultFontStyle.fontStyle;
      this._style.fontVariant = (val.fontVariant !== undefined) ? val.fontVariant : defaultFontStyle.fontVariant;
      this._style.fontWeight = (val.fontWeight !== undefined) ? val.fontWeight : defaultFontStyle.fontWeight;
      this._style.align = (val.align !== undefined) ? val.align : defaultFontStyle.align;
      this._style.lineHeight = (val.lineHeight !== undefined) ? val.lineHeight : defaultFontStyle.lineHeight;
      this._style.wrap = (val.wrap !== undefined) ? val.wrap : defaultFontStyle.wrap;
      this._style.wrapWidth = (val.wrapWidth !== undefined) ? val.wrapWidth : defaultFontStyle.wrapWidth;
      this._style.breakWord = (val.breakWord !== undefined) ? val.breakWord : defaultFontStyle.breakWord;
      this._style.padding = (val.padding !== undefined) ? val.padding : defaultFontStyle.padding;

      this._updateTexture();
    }
  }

  _updateTexture() {
    // generate font style string
    const fontSizeStr = (typeof this._style.fontSize === 'number') ? `${this._style.fontSize}px` : this._style.fontSize;
    const fontStr =  `${this._style.fontStyle} ${this._style.fontVariant} ${this._style.fontWeight} ${fontSizeStr} ${this._style.fontFamily}`;
    const measured = _measureText(this._text, this._style, fontStr);
    const rectWidth = Math.ceil(measured.rectWidth + this._style.padding * 2);
    const rectHeight = Math.ceil(measured.rectHeight + this._style.padding * 2);
    const lines = measured.lines;
    const lineWidths = measured.lineWidths;

    this._canvas.width = bits.nextPow2(rectWidth)
    this._canvas.height = bits.nextPow2(rectHeight);
    let ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    ctx.font = fontStr;
    ctx.fillStyle = this._style.fillStyle; // TODO: other properties

    let cursorX = 0;
    let cursorY = 0;

    // draw lines
    for(let i = 0; i < lines.length; ++i) {
      cursorX = 0;
      cursorY = i * Math.max(this._style.lineHeight, this._style.fontSize);
      if (this._style.align === 'right') {
        cursorX += rectWidth - lineWidths[i];
      } else if (this._style.align === 'center') {
        cursorX += (rectWidth - lineWidths[i]) / 2;
      }

      ctx.fillText(lines[i], cursorX + this._style.padding, cursorY);
    }

    // update texture
    this._texture.width = this._canvas.width;
    this._texture.height = this._canvas.height;
    this._texture.setImages([this._canvas]);
    this._texture.commit();
  }

}