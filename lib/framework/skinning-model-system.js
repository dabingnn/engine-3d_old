import { System } from 'ecs.js';
import { FixedArray } from 'memop';

export default class SkinningModelSystem extends System {
  constructor() {
    super();

    this._comps = new FixedArray(200);
  }

  add(comp) {
    comp.entity.on('skinning-model-changed', this._onCompChanged);
    comp.entity.on('skinning-model-enable-changed', this._onCompEnableChanged);

    this._comps.push(comp);
  }

  remove(comp) {
    comp.entity.off('skinning-model-changed', this._onCompChanged);
    comp.entity.off('skinning-model-enable-changed', this._onCompEnableChanged);

    for (let i = 0; i < this._comps.length; ++i) {
      let c = this._comps.data[i];
      if (c === comp) {
        this._comps.fastRemove(i);
        break;
      }
    }
  }

  tick() {
    for (let i = 0; i < this._comps.length; ++i) {
      let comp = this._comps.data[i];
      comp._updateMatrices();
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