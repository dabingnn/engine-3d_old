import { System } from 'ecs.js';
import { FixedArray } from 'memop';

export default class ParticleSystemManager extends System {
  constructor() {
    super();

    this._particleSystems = new FixedArray(10);
  }

  add(comp) {
    this._particleSystems.push(comp);
  }

  remove(comp) {
    for (let i = 0; i < this._particleSystems.length; ++i) {
      let c = this._particleSystems.data[i];
      if (c === comp) {
        this._particleSystems.fastRemove(i);
        break;
      }
    }
  }

  tick() {
    for (let i = 0; i < this._particleSystems.length; ++i) {
      let particleSystem = this._particleSystems.data[i];
      particleSystem.tick(this._app.deltaTime);
    }
  }
}