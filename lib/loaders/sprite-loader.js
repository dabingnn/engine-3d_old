import resl from '../misc/resl';
import Sprite from '../assets/sprite';
import async from '../misc/async';

export default function (app, urls, callback) {
  resl({
    manifest: {
      json: {
        type: 'text',
        parser: JSON.parse,
        src: urls.json,
      }
    },
    onDone(data) {
      const { json } = data;
      let sprite = new Sprite();
      sprite._x = json.x;
      sprite._y = json.y;
      sprite._width = json.width;
      sprite._height = json.height;
      sprite._rotated = json.rotated;
      let tasks = [];
      tasks.push(done => {
        app.assets.load(json.texture, (err, asset) => {
          sprite._texture = asset;
          done();
        });
      });

      async.parallel(tasks, err => {
        if (err) {
          console.error(err);
        }

        callback(null, sprite);
      });
    }
  })
}