import resl from '../misc/resl';
import {parse} from 'opentype.js';
import OpenTypeFont from '../assets/otfont';

export default function (app, urls, callback) {
  resl({
    manifest: {
      bin: {
        type: 'binary',
        src: urls.bin,
      }
    },

    onDone(data) {
      const { bin } = data;
      let fontAsset = new OpenTypeFont(app.device, 512, 512);
      //let parsedFont = opentype.parseBuffer(bin);
      let parsedFont = parse(bin);
      fontAsset.font = parsedFont;

      callback(null, fontAsset);
    }

  });
}
