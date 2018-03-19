import { Component, Entity } from 'ecs.js';
import { vec3, quat } from 'vmath';
import async from '../../misc/async';

// UNUSED code
// function _mainUuid(uuid) {
//   let idx = uuid.indexOf('@');
//   if (idx === -1) {
//     return uuid;
//   }

//   return uuid.substring(idx+1);
// }

/**
 * @param {App} app
 * @param {Entity} ent
 * @param {object} info
 */
function createComponent(app, ent, info) {
  const ctor = app.getClass(info.type);
  if (!ctor) {
    let comp = new Component();
    comp._app = app;
    comp._system = null;
    comp._entity = ent;

    console.error(`component type ${info.type} not found.`);
    return comp;
  }

  const data = info.properties;
  let comp = app._createComp(ctor, ent, data);

  if (info.enabled !== undefined) {
    comp._enabled = info.enabled;
  }

  // console.warn(`Failed to load component ${info.type}, parser not found.`);
  return comp;
}

/**
 * @param {App} app
 * @param {object} info
 */
function createEntity(app, info) {
  let ent = new Entity(info.name);
  ent._app = app;

  if (info.enabled !== undefined) {
    ent._enabled = info.enabled;
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
 * @param {object} info
 * @param {function} callback
 */
function createPrefab(app, json) {
  let entInfos = json.entities;
  let entities = new Array(json.entities.length);

  for (let i = 0; i < entInfos.length; ++i) {
    let entInfo = entInfos[i];
    if (entInfo.prefab) {
      // TODO: implement nested prefab
      // TODO: nested prefab needs prefabTree, which can help for detecting recursive reference
      console.warn('nested prefab have not implemented.');
    } else {
      entities[i] = createEntity(app, entInfo);
    }
  }

  finalize(entities, entInfos);

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
 * @param {Array} entities
 * @param {Array} entityInfos
 */
function finalize(entities, entityInfos) {
  for (let i = 0; i < entityInfos.length; ++i) {
    let entInfo = entityInfos[i];
    let ent = entities[i];

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

    if (entInfo.children) {
      for (let j = 0; j < entInfo.children.length; ++j) {
        let index = entInfo.children[j];
        ent.append(entities[index]);
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