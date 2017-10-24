import resl from '../misc/resl';
import BMFont from '../assets/bmfont';
import async from '../misc/async';
import { color4, vec2, vec3, mat4 } from 'vmath';

export default function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      },
      // todo: depends on app.assets.loadInfo
      // image: {
      // ...
      // }
    },

    onDone(data) {
      const { json } = data;
      let font = new BMFont();
      font._json = json;

      let tasks = [];
      tasks.push(done => {
        app.assets.load(json.texture, (err, asset) => {
          font._texture = asset;
          done();
        });
      });

      async.parallel(tasks, err => {
        if (err) {
          console.error(err);
          callback(err, null);
        }
        font.commit();
        callback(null, font);
      });
    }
  })
}
