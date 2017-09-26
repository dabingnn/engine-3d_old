import { System } from 'ecs.js';
import { FixedArray } from 'memop';

function _walk(entity, callback) {
  if (entity && callback) {
    callback(entity);
  }

  if (entity) {
    entity.children.forEach(child => {
      _walk(child, callback);
    });
  }
}

export default class ScreenSystem extends System {
  constructor() {
    super();
    this._canvases = new FixedArray(4);
  }

  add(comp) {
    this._canvases.push(comp);
    this._engine.scene.addModel(comp._model);
  }

  remove(comp) {
    let idx = this._canvases.indexOf(comp);
    if (idx !== -1) {
      this._canvases.fastRemove(idx);
    }
    this._engine.scene.removeModel(comp._model);
  }

  tick() {
    for (let index = 0; index < this._canvases.length; ++index) {
      let canvas = this._canvases.data[index];
      let model = canvas._model;
      model.clearModelDatas();
      let canvasRoot = canvas._entity;
      _walk(canvasRoot, entity => {
        let spriteComp = entity.getComp('SpriteModel');
        if (spriteComp) {
          model.addModelData(spriteComp.getModelData());
        }
      });

    }
  }
}