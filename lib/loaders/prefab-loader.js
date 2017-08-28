import resl from '../misc/resl';
import Prefab from '../assets/prefab';
import ecsUtils from './utils/ecs-utils';

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
      ecsUtils.preloadAssets(app, data.json, (err, assets) => {
        let prefab = new Prefab();
        prefab._app = app;
        prefab._json = data.json;
        prefab._assets = assets;

        if (err) {
          callback(err);
          return;
        }

        callback(null, prefab);
      });
    }
  });
}