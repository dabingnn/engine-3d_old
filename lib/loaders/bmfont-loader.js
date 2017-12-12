import resl from '../misc/resl';
import BMFont from '../assets/bmfont';
import { vec2 } from 'vmath';

export default function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
    },

    onDone(data) {
      const { json } = data;
      let font = new BMFont();
      app.assets.load(json.texture, (err, asset) => {
        if (err) {
          console.error(err);
          callback(err, null);
          return;
        }

        let textureWidth = asset._texture._width;
        let textureHeight = asset._texture._height;

        font._texture = asset;
        font._face = json.face;
        font._size = json.size;
        font._lineHeight = json.lineHeight;

        // TODO: add kernings here
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

          font._characters[charCode] = {
            char: String.fromCharCode(charCode),
            x: charInfo.x,
            y: charInfo.y,
            width: charInfo.width,
            height: charInfo.height,
            xoffset: charInfo.xoffset,
            yoffset: charInfo.yoffset,
            xadvance: charInfo.xadvance
          };
          font._characters[charCode].uvs = [
            vec2.new(u0, v0),
            vec2.new(u1, v0),
            vec2.new(u0, v1),
            vec2.new(u1, v1)
          ];
        }

        callback(null, font);
      });
    }
  });
}
