import { System } from 'ecs.js';
import { FixedArray } from 'memop';

export default class SkinningModelSystem extends System {
  constructor() {
    super();

    this._comps = new FixedArray(200);
  }

  add(comp) {
    this._comps.push(comp);
  }

  remove(comp) {
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
      if (comp.enabled === false) {
        continue;
      }

      comp._updateMatrices();
    }
  }
}