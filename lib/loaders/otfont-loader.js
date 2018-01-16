import resl from '../misc/resl';
import {parse} from 'opentype.js';
import OpenTypeFont from '../assets/otfont';

export default function (app, urls, callback) {
  let manifest = {};
  manifest.bin = {
    type: 'binary',
    src: urls.bin,
  };
  if (urls.json) {
    manifest.json = {
      type: 'text',
      parser: JSON.parse,
      src: urls.json,
    };
  }
  resl({
    manifest,
    onDone(data) {
      const { bin, json } = data;
      let fontAsset = null;
      if (json && json.width && json.height) {
        fontAsset = new OpenTypeFont(app.device, json.width, json.height);
      } else {
        fontAsset = new OpenTypeFont(app.device, 512, 512);
      }
      let parsedFont = parse(bin);
      fontAsset.font = parsedFont;

      callback(null, fontAsset);
    }

  });
}
