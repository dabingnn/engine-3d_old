import { Component, Entity } from 'ecs.js';
import { vec3, quat } from 'vmath';
import resl from '../../misc/resl';
import path from '../../misc/path';
import async from '../../misc/async';
// import parseMesh from '../../parsers/mesh-parser';
// import parseMaterial from '../../parsers/material-parser';

/**
 * @param {object} info
 */
function createComponent(app, ent, info, baseUrl, callback) {
  const ctor = app.getClass(info.type);
  if (!ctor) {
    let comp = new Component();
    comp._engine = app;
    comp._entity = ent;

    callback(
      new Error(`component type ${info.type} not found.`),
      comp
    );
    return;
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
  } else if (info.type === 'Model') {
    let tasks = [];

    // load materials
    for (let i = 0; i < props.materials.length; ++i) {
      let propMat = props.materials[i];
      tasks.push(done => {
        resl({
          manifest: {
            json: {
              type: 'text',
              parser: JSON.parse,
              src: path.join(baseUrl, propMat.urls.json)
            },
          },
          onDone(data) {
            parseMaterial(app, data.json, baseUrl, (err, asset) => {
              comp.material = asset;
              done();
            });
          }
        });
      });
    }

    // load mesh
    tasks.push(done => {
      resl({
        manifest: {
          gltf: {
            type: 'text',
            parser: JSON.parse,
            src: path.join(baseUrl, props.mesh.urls.gltf)
          },
          bin: {
            type: 'binary',
            src: path.join(baseUrl, props.mesh.urls.bin)
          },
        },
        onDone(data) {
          parseMesh(app, data.gltf, data.bin, (err, asset) => {
            comp.mesh = asset;
            done();
          });
        }
      });
    });

    async.parallel(tasks, err => {
      callback(err, comp);
    });
  } else if (info.type === 'Camera') {
    // TODO
    callback(null, comp);
  }
}

/**
 * @param {object} info
 */
function createEntity(app, info, baseUrl, callback) {
  let ent = new Entity(info.name);
  ent._engine = app;

  if (info.components) {
    let loaded = 0;

    for (let i = 0; i < info.components.length; ++i) {
      let compInfo = info.components[i];
      ent._comps = new Array(info.components.length);

      createComponent(app, ent, compInfo, baseUrl, (err, comp) => {
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

    return;
  }

  if (callback) {
    callback(null, ent);
  }
}

/**
 * @param {object} info
 */
function createPrefab(app, info, baseUrl, callback) {
  let entInfos = info.entities;
  let entities = new Array(info.entities.length);
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
      createEntity(app, entInfo, baseUrl, (err, ent) => {
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
    }

    if (entInfo.rotation) {
      quat.set(
        ent.lrot,
        entInfo.rotation[0],
        entInfo.rotation[1],
        entInfo.rotation[2],
        entInfo.rotation[3]
      );
    }

    if (entInfo.scale) {
      vec3.set(
        ent.lscale,
        entInfo.scale[0],
        entInfo.scale[1],
        entInfo.scale[2]
      );
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
  finalize,
};