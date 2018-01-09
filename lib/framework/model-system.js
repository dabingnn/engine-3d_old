import { System } from 'ecs.js';

export default class ModelSystem extends System {
  constructor() {
    super();
  }

  add(comp) {
    comp.entity.on('model-changed', this._onCompChanged);
    comp.entity.on('model-enable-changed', this._onCompEnableChanged);
  }

  remove(comp) {
    comp.entity.off('model-changed', this._onCompChanged);
    comp.entity.off('model-enable-changed', this._onCompEnableChanged);
  }

  _onCompChanged(comp, name, oldData) {
    if (name === 'mesh') {
      for (let i = 0; i < oldData.length; ++i) {
        this._engine.scene.removeModel(oldData[i]);
      }
      for (let i = 0; i < comp._models.length; ++i) {
        this._engine.scene.addModel(comp._models[i]);
      }
    }
  }

  _onCompEnableChanged(comp, val) {
    if (val) {
      for (let i = 0; i < comp._models.length; ++i) {
        this._engine.scene.addModel(comp._models[i]);
      }
    } else {
      for (let i = 0; i < comp._models.length; ++i) {
        this._engine.scene.removeModel(comp._models[i]);
      }
    }
  }
}