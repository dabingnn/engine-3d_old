import { Level } from 'ecs.js';
import ecsUtils from './ecs-utils';
import { utils } from 'scene-graph';
import async from '../../misc/async';
import { vec3, quat, color3, color4 } from 'vmath';

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

function _applyModifications(app, target, entInfo, callback) {
  let entities = utils.flat(target);
  let tasks = [];

  for (let i = 0; i < entInfo.modifications.length; i++) {
    let mod = entInfo.modifications[i];
    let ent = entities[mod.entity];
    let words = mod.property.split('.');

    let comp = ent.getComp(words[0]);
    if (comp === null) {
      console.warn(`Failed to apply modification for entity ${ent.name}: component ${words[0]} not found.`);
      continue;
    }

    if (words[1].indexOf('material') !== -1) {
      let uuid = mod.value;
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
  }

  async.parallel(tasks, err => {
    callback(err);
  });
}

function _applyUI(app, screen) {
  let wmat = vec3.create();
  let color = color3.new(0.5, 0.5, 0.0);
  let wpos = vec3.create();
  let wrot = quat.create();
  let a = vec3.create();
  let b = vec3.create();
  let c = vec3.create();
  let d = vec3.create();

  app.on('tick', () => {
    cc.utils.walk(screen, (ent) => {
      if (screen === ent) {
        return true;
      }

      ent.getWorldMatrix(wmat);
      let widget = ent.getComp('Widget');
      // a
      vec3.set(a,
        -widget.pivotX * widget._calcWidth,
        -widget.pivotY * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(a, a, wmat);
      // b
      vec3.set(b,
        -widget.pivotX * widget._calcWidth,
        (1.0 - widget.pivotY) * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(b, b, wmat);
      // c
      vec3.set(c,
        (1.0 - widget.pivotX) * widget._calcWidth,
        (1.0 - widget.pivotY) * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(c, c, wmat);
      // d
      vec3.set(d,
        (1.0 - widget.pivotX) * widget._calcWidth,
        -widget.pivotY * widget._calcHeight,
        0.0
      );
      vec3.transformMat4(d, d, wmat);
      // rect
      app.debugger.drawLine2D(a, b, color);
      app.debugger.drawLine2D(b, c, color);
      app.debugger.drawLine2D(c, d, color);
      app.debugger.drawLine2D(d, a, color);

      app.debugger.drawAxes2D(
        ent.getWorldPos(wpos),
        ent.getWorldRot(wrot),
        5.0
      );

      return true;
    });
  })
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

        if (entInfo.modifications !== undefined) {
          _applyModifications(app, entities[i], entInfo, err => {
            if (err) {
              console.error(err);
              return;
            }

            loaded += 1;
            if (loaded === entInfos.length) {
              _finalize(app, json, entities, callback);
            }
          });
        } else {
          loaded += 1;
          if (loaded === entInfos.length) {
            _finalize(app, json, entities, callback);
          }
        }
      });
    } else {
      ecsUtils.createEntity(app, entInfo, (err, ent) => {
        if (err) {
          console.error(`Failed to load entity ${entInfo.name}: ${err}`);
          return;
        }

        entities[i] = ent;

        if (entities[i].getComp('Screen') !== null) {
          _applyUI(app, entities[i]);
        }

        loaded += 1;
        console.log(`${entInfo.name} loaded`);

        if (loaded === entInfos.length) {
          _finalize(app, json, entities, callback);
        }
      });
    }
  }
}