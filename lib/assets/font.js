import Asset from './asset';

let _wordSep = new RegExp(/([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/);

export default class Font extends Asset {
  constructor() {
    super();

    this._size = 32; // font size
    this._type = 'unknow'; // font type: bitmap or opentype
    // bitmap font glyph: {char, x, y, width, height, xoffset, yoffset, xadvance}
    // opentype font glyph: {id, x, y, width, height, xoffset, yoffset, xadvance}
    this._glyphs = {};
    this._lineHeight = 32;
    this._useKerning = false;
  }

  get size() {
    return this._size;
  }

  get lineHeight() {
    return this._lineHeight;
  }

  get type() {
    return this._type;
  }

  // get width of single line text
  getTextWidth(text, fontSize) {
    let result = 0;
    let fontScale = fontSize / this._size;
    for (let i = 0; i < text.length; ++i) {
      let charCode = text.charCodeAt(i);
      let glyph = this._glyphs[charCode] || this._defaultGlyph;
      result += glyph.xadvance * fontScale;
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

}