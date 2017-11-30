import { Component, Entity } from 'ecs.js';
import { vec3, quat } from 'vmath';
import async from '../../misc/async';

function _mainUuid(uuid) {
  let idx = uuid.indexOf('@');
  if (idx === -1) {
    return uuid;
  }

  return uuid.substring(idx+1);
}

/**
 * @param {App} app
 * @param {Entity} ent
 * @param {object} info
 * @param {function} callback
 */
function createComponent(app, ent, info, callback) {
  const ctor = app.getClass(info.type);
  if (!ctor) {
    let comp = new Component();
    comp._engine = app;
    comp._entity = ent;

    callback(
      new Error(`component type ${info.type} not found.`),
      comp
    );
    return comp;
  }

  let comp = new ctor();
  comp._engine = app;
  comp._entity = ent;

  // invoke onInit
  if (comp.onInit) {
    comp.onInit();
  }

  const props = info.properties;

  if (info.type === 'Light') {
    comp.setColor(props.color[0], props.color[1], props.color[2]);
    callback(null, comp);
  } else if (info.type === 'Model' || info.type === 'SkinningModel') {
    let tasks = [];

    // load materials
    for (let i = 0; i < props.materials.length; ++i) {
      let uuid = props.materials[i];
      tasks.push(done => {
        app.assets.load(uuid, (err, asset) => {
          if (err) {
            console.error(err);
            done();
            return;
          }

          comp.material = asset;
          done();
        });
      });
    }

    // load mesh
    tasks.push(done => {
      app.assets.load(props.mesh, (err, asset) => {
        if (err) {
          console.error(err);
          done();
          return;
        }

        comp.mesh = asset;
        done();
      });
    });

    async.parallel(tasks, err => {
      callback(err, comp);
    });
  } else if (info.type === 'Camera') {
    // TODO
    callback(null, comp);
  } else if (info.type === 'Animation') {
    let tasks = [];

    // load animations
    for (let i = 0; i < props.animations.length; ++i) {
      let uuid = props.animations[i];
      tasks.push(done => {
        app.assets.load(uuid, (err, asset) => {
          if (err) {
            console.error(err);
            done();
            return;
          }

          comp.addClip(asset.name, asset);
          done();
        });
      });
    }

    // load joints
    tasks.push(done => {
      app.assets.load(props.joints, (err, asset) => {
        if (err) {
          console.error(err);
          done();
          return;
        }

        comp.skeleton = asset.instantiate();
        done();
      });
    });

    async.parallel(tasks, err => {
      callback(err, comp);
    });
  } else if (info.type === 'Screen') {
    callback(null, comp);
  } else if (info.type === 'Widget') {
    let screen = ent.getComp('Screen');

    comp.setPivot(props.pivotX, props.pivotY);
    comp.setSize(props.width, props.height);
    comp.setAnchors(props.anchorLeft, props.anchorBottom, props.anchorRight, props.anchorTop);
    comp.setMargin(props.marginLeft, props.marginBottom, props.marginRight, props.marginTop);
    comp.offsetX = props.offsetX;
    comp.offsetY = props.offsetY;

    callback(null, comp);
  }

  return comp;
}

/**
 * @param {App} app
 * @param {object} info
 * @param {function} callback
 */
function createEntity(app, info, callback) {
  let ent = new Entity(info.name);
  ent._engine = app;

  // if we don't have component, just return
  if (!info.components) {
    if (callback) {
      callback(null, ent);
    }

    return ent;
  }

  // load components (async)
  let loaded = 0;
  ent._comps = new Array(info.components.length);

  for (let i = 0; i < info.components.length; ++i) {
    let compInfo = info.components[i];
    createComponent(app, ent, compInfo, (err, comp) => {
      if (err) {
        console.error(`Failed to load component: ${err}`);
      }

      ent._comps[i] = comp;
      loaded += 1;

      if (loaded === info.components.length) {
        if (callback) {
          callback(null, ent);
        }
      }
    });
  }

  return ent;
}

/**
 * @param {App} app
 * @param {object} info
 * @param {function} callback
 */
function createPrefab(app, json, callback) {
  let entInfos = json.entities;
  let entities = new Array(json.entities.length);
  let loaded = 0;

  for (let i = 0; i < entInfos.length; ++i) {
    let entInfo = entInfos[i];
    if (entInfo.prefab) {
      // TODO: implement nested prefab
      // TODO: nested prefab needs prefabTree, which can help for detecting recursive reference
      if (callback) {
        callback(new Error('nested prefab have not implemented.'));
      }
    } else {
      createEntity(app, entInfo, (err, ent) => {
        if (err) {
          console.error(`Failed to load entity ${entInfo.name}: ${err}`);
          return;
        }

        entities[i] = ent;
        loaded += 1;

        if (loaded === entInfos.length) {
          finalize(entities, entInfos);
          if (callback) {
            callback(null, entities[0]);
          }
        }
      });
    }
  }

  return entities[0];
}

/**
 * @param {App} app
 * @param {object} json
 * @param {function} callback
 */
function preloadAssets(app, json, callback) {
  const entInfos = json.entities;
  let assets = {};
  let uuids = [];
  let tasks = [];

  for (let i = 0; i < entInfos.length; ++i) {
    const entInfo = entInfos[i];

    if (!entInfo.components) {
      continue;
    }

    // get assets in component
    for (let c = 0; c < entInfo.components.length; ++c) {
      const compInfo = entInfo.components[c];
      const props = compInfo.properties;

      if (compInfo.type === 'Model' || compInfo.type === 'SkinningModel') {
        let uuid;

        // materials
        for (let m = 0; m < props.materials.length; ++m) {
          // NOTE: the uuid may contain sub-asset
          uuid = _mainUuid(props.materials[m]);
          if (uuids.indexOf(uuid) === -1) {
            uuids.push(uuid);
          }
        }

        // mesh
        // NOTE: the uuid may contain sub-asset
        uuid = _mainUuid(props.mesh);
        if (uuids.indexOf(uuid) === -1) {
          uuids.push(uuid);
        }
      } else if (compInfo.type === 'Animation') {
        let uuid;

        // animations
        for (let a = 0; a < props.animations.length; ++a) {
          // NOTE: the uuid may contain sub-asset
          uuid = _mainUuid(props.animations[a]);
          if (uuids.indexOf(uuid) === -1) {
            uuids.push(uuid);
          }
        }

        // joints
        // NOTE: the uuid may contain sub-asset
        uuid = _mainUuid(props.joints);
        if (uuids.indexOf(uuid) === -1) {
          uuids.push(uuid);
        }
      }
    }
  }

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