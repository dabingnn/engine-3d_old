import { Level } from 'ecs.js';
import ecsUtils from './ecs-utils';
import resl from '../misc/resl';
import path from '../misc/path';

function _finalize(app, json, entities, callback) {
  let level = new Level();

  ecsUtils.finalize(entities, json.entities);
  for (let i = 0; i < json.children.length; ++i) {
    let idx = json.children[i];
    level.append(entities[idx]);
  }

  if (callback) {
    callback(null, level);
  }
}

export default function (app, json, baseUrl, callback) {
  let entInfos = json.entities;
  let entities = new Array(json.entities.length);
  let loaded = 0;

  for (let i = 0; i < entInfos.length; ++i) {
    let entInfo = entInfos[i];
    if (entInfo.prefab) {
      // load prefab
      if (entInfo.prefab.type === 'prefab') {
        resl({
          manifest: {
            json: {
              type: 'text',
              parser: JSON.parse,
              src: path.join(baseUrl, entInfo.prefab.urls.json),
            },
          },
          onDone(data) {
            ecsUtils.createPrefab(app, data.json, baseUrl, (err, ent) => {
              if (err) {
                console.error(`Failed to load entity ${entInfo.name}: ${err}`);
                return;
              }

              entities[i] = ent;
              loaded += 1;
              console.log(`${entInfo.name} loaded`);

              if (loaded === entInfos.length) {
                _finalize(app, json, entities, callback);
              }
            });
          }
        });
      } else {
        console.error(`${entInfo.prefab.type} have not support yet.`);

        loaded += 1;
        console.log(`${entInfo.name} loaded`);

        if (loaded === entInfos.length) {
          _finalize(app, json, entities, callback);
        }
      }
    } else {
      ecsUtils.createEntity(app, entInfo, baseUrl, (err, ent) => {
        if (err) {
          console.error(`Failed to load entity ${entInfo.name}: ${err}`);
          return;
        }

        entities[i] = ent;
        loaded += 1;
        console.log(`${entInfo.name} loaded`);

        if (loaded === entInfos.length) {
          _finalize(app, json, entities, callback);
        }
      });
    }
  }
}