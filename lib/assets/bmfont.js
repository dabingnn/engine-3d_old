import Asset from './asset';

let _wordSep = new RegExp(/([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/);

export default class BMFont extends Asset {
  constructor() {
    super();

    this._texture = null;
    this._face = '';
    this._size = 32;
    this._lineHeight = 32;
    this._characters = {};
  }

  get texture() {
    return this._texture;
  }

  get face() {
    return this._face;
  }

  get size() {
    return this._size;
  }

  get lineHeight() {
    return this._lineHeight;
  }

  // get width of single line text
  getTextWidth(text, fontSize) {
    let result = 0;
    let defaultCharInfo = this._characters[32];
    let fontScale = fontSize / this._size;
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
}