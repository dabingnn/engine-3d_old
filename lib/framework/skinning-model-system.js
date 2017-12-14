import { System } from 'ecs.js';

export default class SkinningModelSystem extends System {
  constructor() {
    super();
  }

  add(comp) {
    comp.entity.on('skinning-model-changed', this._onCompChanged);
  }

  remove(comp) {
    comp.entity.off('skinning-model-changed', this._onCompChanged);
  }

  _onCompChanged(comp, name, val) {
    if (name === 'enabled') {
      if (val) {
        this._engine.scene.addModel(comp._model);
      } else {
        this._engine.scene.removeModel(comp._model);
      }
    }
  }
}