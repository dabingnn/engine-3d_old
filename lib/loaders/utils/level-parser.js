import { Level } from 'ecs.js';
import ecsUtils from './ecs-utils';
import { utils } from 'scene-graph';

function _applyModifications(app, target, entInfo) {
  let entities = utils.flat(target);

  for (let i = 0; i < entInfo.modifications.length; i++) {
    let mod = entInfo.modifications[i];
    let ent = entities[mod.entity];
    let words = mod.property.split('.');

    if (words.length === 1) {
      ent[mod.property] = mod.value;

      continue;
    }

    let comp = ent.getComp(words[0]);
    if (comp === null) {
      console.warn(`Failed to apply modification for entity ${ent.name}: component ${words[0]} not found.`);
      continue;
    }

    if (words[1].indexOf('material') !== -1) {
      comp.material = mod.value;
    } else {
      comp[words[1]] = mod.value;
    }
  }
}

export default function (app, json, callback) {
  ecsUtils.preloadAssets(app, json, () => {
    let entInfos = json.entities;
    let entities = new Array(json.entities.length);

    for (let i = 0; i < entInfos.length; ++i) {
      let entInfo = entInfos[i];
      if (entInfo.prefab) {
        let prefab = app.assets.get(entInfo.prefab);
        if (!prefab) {
          console.error(`Failed to load prefab ${entInfo.prefab}`);
          continue;
        }

        entities[i] = prefab.instantiate();
        console.log(`${entInfo.name} loaded`);

        if (entInfo.modifications !== undefined) {
          _applyModifications(app, entities[i], entInfo);
        }
      } else {
        entities[i] = ecsUtils.createEntity(app, entInfo);
        console.log(`${entInfo.name} loaded`);
      }
    }

    // finalize
    let level = new Level();

    ecsUtils.finalize(entities, json.entities);
    for (let i = 0; i < json.children.length; ++i) {
      let idx = json.children[i];
      level.append(entities[idx]);
    }

    if (callback) {
      callback(null, level);
    }
  });
}