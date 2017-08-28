import { Level } from 'ecs.js';
import ecsUtils from './ecs-utils';

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

export default function (app, json, callback) {
  let entInfos = json.entities;
  let entities = new Array(json.entities.length);
  let loaded = 0;

  for (let i = 0; i < entInfos.length; ++i) {
    let entInfo = entInfos[i];
    if (entInfo.prefab) {
      app.assets.load(entInfo.prefab, (err, prefab) => {
        if (err) {
          console.error(`Failed to load entity ${entInfo.name}: ${err}`);
        } else {
          entities[i] = prefab.instantiate();
          console.log(`${entInfo.name} loaded`);
        }

        loaded += 1;
        if (loaded === entInfos.length) {
          _finalize(app, json, entities, callback);
        }
      });
    } else {
      ecsUtils.createEntity(app, entInfo, (err, ent) => {
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