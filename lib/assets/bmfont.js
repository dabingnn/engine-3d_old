import Asset from './asset';
import { color4, vec2, vec3, mat4 } from 'vmath';
import enums from '../enums';

let _wordSep = new RegExp(/([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/);

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

  // get width of single line text
  getTextWidth(text, fontSize) {
    let result = 0;
    let defaultCharInfo = this._characters[32];
    let fontScale = fontSize / this._fontSize;
    for (let i = 0; i < text.length; ++i) {
      let charCode = text.charCodeAt(i);
      let charInfo = this._characters[charCode] || defaultCharInfo;
      result += charInfo.xadvance * fontScale;
    }

    return result;
  }

  getWrappedInfos(text, fontSize, lineHeight, width) {
    let results = [];
    let words = text.split(_wordSep);
    let lastIndex = 0;
    let index = 0;
    let accWordsWidth = 0;
    // sep + word pair
    for (let i = 0; i + 1 < words.length;) {
      let sepWidth = this.getTextWidth(words[i], fontSize);
      let wordWidth = this.getTextWidth(words[i + 1], fontSize);
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

  genTextVertices(out, text, alignH, alignV, wrap, width, height, fontSize, lineHeight) {
    let cursorY = 0;
    let defaultCharInfo = this._characters[32];
    let paragraphs = text.split('\n');
    let fontScale = fontSize / this._fontSize;
    let totalLines = 0;
    let totalChars = 0;
    let fillLine = (para, start, end) => {
      let cursorX = 0;
      for (let i = 0; i < end - start; ++i) {
        let charCode = para.charCodeAt(i + start);
        let charInfo = this._characters[charCode] || defaultCharInfo;
        let x0 = cursorX + charInfo.xoffset * fontScale;
        let x1 = cursorX + (charInfo.width + charInfo.xoffset) * fontScale;
        let y0 = cursorY - (charInfo.height + charInfo.yoffset) * fontScale;
        let y1 = cursorY - charInfo.yoffset * fontScale;
        out.positionAccess(totalChars + i, (err, pos0, pos1, pos2, pos3) => {
          if (err) {
            console.error(err);
            return;
          }
          vec3.set(pos0, x0, y0, 0);
          vec3.set(pos1, x1, y0, 0);
          vec3.set(pos2, x0, y1, 0);
          vec3.set(pos3, x1, y1, 0);
        });

        out.uvAccess(totalChars + i, (err, uv0, uv1, uv2, uv3) => {
          if (err) {
            console.error(err);
            return;
          }
          vec3.copy(uv0, charInfo.uvs[0]);
          vec3.copy(uv1, charInfo.uvs[1]);
          vec3.copy(uv2, charInfo.uvs[2]);
          vec3.copy(uv3, charInfo.uvs[3]);
        });

        cursorX += charInfo.xadvance * fontScale;
      }
      // process alignH
      if (cursorX < width) {
        for (let i = 0; i < end - start; ++i) {
          let offsetX = (width - cursorX) * alignH;
          out.positionAccess(totalChars + i, (err, pos0, pos1, pos2, pos3) => {
            if (err) {
              console.error(err);
              return;
            }
            pos0.x = pos0.x + offsetX;
            pos1.x = pos1.x + offsetX;
            pos2.x = pos2.x + offsetX;
            pos3.x = pos3.x + offsetX;
          });
        }
      }
      totalChars += end - start;
      ++totalLines;
      cursorY -= lineHeight * this._lineHeight * fontScale;
    }

    if (wrap) {
      for (let i = 0; i < paragraphs.length; ++i) {
        let wrapInfo = this.getWrappedInfos(paragraphs[i], fontSize, lineHeight, width);
        for (let j = 0; j < wrapInfo.length; ++j) {
          fillLine(paragraphs[i], wrapInfo[j].start, wrapInfo[j].end);
        }
      }
    } else {
      for (let i = 0; i < paragraphs.length; ++i) {
        fillLine(paragraphs[i], 0, paragraphs[i].length);
      }
    }

    // process alignV and move it to [0,0, width, height] rect
    let labelHeight = totalLines * lineHeight * this._lineHeight * fontScale;
    let alignVOffset = labelHeight < height ? (height - labelHeight) * -alignV : 0.0;
    let rectOffset = height;
    for (let i = 0; i < totalChars; ++i) {
      out.positionAccess(i, (err, pos0, pos1, pos2, pos3) => {
        if (err) {
          console.error(err);
          return;
        }
        pos0.y = pos0.y + alignVOffset + rectOffset;
        pos1.y = pos1.y + alignVOffset + rectOffset;
        pos2.y = pos2.y + alignVOffset + rectOffset;
        pos3.y = pos3.y + alignVOffset + rectOffset;
      });
    }
    return totalChars;
  }
}