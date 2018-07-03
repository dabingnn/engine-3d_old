import { Component, Entity } from '../../ecs';
import { vec3, quat } from '../../vmath';
import async from '../../misc/async';

// UNUSED code
// function _mainUuid(uuid) {
//   let idx = uuid.indexOf('@');
//   if (idx === -1) {
//     return uuid;
//   }
//   return uuid.substring(idx+1);
// }

// NOTE: the json is prefab's json
function _applyModifications(json, modifications) {
  for (let i = 0; i < modifications.length; i++) {
    let mod = modifications[i];
    let ent = json.entities[mod.entity];
    let words = mod.property.split('.');

    if (words.length === 1) {
      ent[mod.property] = mod.value;
      continue;
    }

    let compInfo = null;
    for (let j = 0; j < ent.components.length; j++) {
      let expectType = words[0];
      let curComp = ent.components[j];
      if (curComp.type === expectType) {
        compInfo = curComp;
        break;
      }
    }

    if (compInfo === null) {
      console.warn(`Failed to apply modification for entity ${ent.name}: component ${words[0]} not found.`);
      continue;
    }

    // TODO: generic the solution by:
    // let words = propPath.split('.')
    // foreach words: word.match(/(.*)\[(\d+)\]/)
    let propPath = words[1];
    let results = propPath.match(/(.*)\[(\d+)\]/);
    if (results) {
      let propName = results[1];
      let idx = parseInt(results[2]);
      compInfo.properties[propName][idx] = mod.value;
    } else {
      if (words[1] === 'enabled') {
        compInfo[words[1]] = mod.value;
      } else {
        compInfo.properties[words[1]] = mod.value;
      }
    }
  }

  return json;
}

/**
 * @param {App} app
 * @param {Entity} ent
 * @param {Object} info
 */
function createComponent(app, ent, info) {
  const ctor = app.getClass(info.type);
  if (!ctor) {
    let comp = new Component();
    comp._app = app;
    comp._system = null;
    comp._entity = ent;
    comp.__events__ = [];
    if (info.enabled !== undefined) {
      comp._enabled = info.enabled;
    }
    console.error(`component type ${info.type} not found.`);
    return comp;
  }

  // DELME
  // const data = info.properties;
  // let comp = app._createComp(ctor, ent, data);
  let comp = new ctor();
  comp._app = app;
  comp._system = app._getSystem(comp);
  comp._entity = ent;
  comp.__events__ = [];
  if (info.enabled !== undefined) {
    comp._enabled = info.enabled;
  }

  // console.warn(`Failed to load component ${info.type}, parser not found.`);
  return comp;
}

/**
 * @param {App} app
 * @param {Object} info
 * @param {Level} level
 */
function createEntity(app, info, level) {
  // let ent = new Entity(info.name);
  // ent._app = app;
  let ent = app.createEntity(info.name, level);

  if (info.enabled !== undefined) {
    ent._active = info.enabled;
  }

  // if we don't have component, just return
  if (!info.components) {
    return ent;
  }

  // load components (async)
  ent._comps = new Array(info.components.length);

  for (let i = 0; i < info.components.length; ++i) {
    let compInfo = info.components[i];
    ent._comps[i] = createComponent(app, ent, compInfo);
  }

  return ent;
}

/**
 * @param {App} app
 * @param {Object} json
 * @param {Object[]} modifications
 * @param {Level} level
 */
function createPrefab(app, json, modifications, level) {
  // apply modificiations
  if (modifications) {
    json = JSON.parse(JSON.stringify(json));
    json = _applyModifications(json, modifications);
  }

  let entInfos = json.entities;
  let entities = new Array(json.entities.length);

  for (let i = 0; i < entInfos.length; ++i) {
    let entInfo = entInfos[i];
    if (entInfo.prefab) {
      // TODO: implement nested prefab
      // TODO: nested prefab needs prefabTree, which can help for detecting recursive reference
      console.warn('nested prefab have not implemented.');
    } else {
      entities[i] = createEntity(app, entInfo, level);
    }
  }

  finalize(app, entities, entInfos);

  return entities[0];
}

/**
 * @param {App} app
 * @param {object} json
 * @param {function} callback
 */
function preloadAssets(app, json, callback) {
  let assets = {};
  let uuids = json.preloads;
  let tasks = [];

  // push tasks
  for (let i = 0; i < uuids.length; ++i) {
    let uuid = uuids[i];
    tasks.push(done => {
      app.assets.load(uuid, (err, asset) => {
        if (err) {
          console.error(err);
          done();
          return;
        }

        assets[uuid] = asset;
        done();
      });
    });
  }

  // load assets
  async.parallel(tasks, err => {
    callback(err, assets);
  });
}

/**
 * @param {App} app
 * @param {Array} entities
 * @param {Array} entityInfos
 */
function finalize(app, entities, entityInfos) {
  for (let i = 0; i < entityInfos.length; ++i) {
    let ent = entities[i];
    let entInfo = entityInfos[i];

    if (!ent) {
      continue;
    }

    if (entInfo.translation) {
      vec3.set(
        ent.lpos,
        entInfo.translation[0],
        entInfo.translation[1],
        entInfo.translation[2]
      );
    } else {
      vec3.set(ent.lpos, 0, 0, 0);
    }

    if (entInfo.rotation) {
      quat.set(
        ent.lrot,
        entInfo.rotation[0],
        entInfo.rotation[1],
        entInfo.rotation[2],
        entInfo.rotation[3]
      );
    } else {
      quat.set(ent.lrot, 0, 0, 0, 1);
    }

    if (entInfo.scale) {
      vec3.set(
        ent.lscale,
        entInfo.scale[0],
        entInfo.scale[1],
        entInfo.scale[2]
      );
    } else {
      vec3.set(ent.lscale, 1, 1, 1);
    }

    // append children
    if (entInfo.children) {
      for (let j = 0; j < entInfo.children.length; ++j) {
        let index = entInfo.children[j];
        ent.append(entities[index]);
      }
    }

    // init comps (events, schema)
    if (entInfo.components) {
      for (let i = 0; i < entInfo.components.length; ++i) {
        let comp = ent._comps[i];
        let compInfo = entInfo.components[i];

        app._finalizeComp(comp, compInfo.properties, entities);
      }
    }
  }
}

export default {
  createComponent,
  createEntity,
  createPrefab,
  preloadAssets,
  finalize,
};