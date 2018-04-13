import { System } from '../ecs';
import { FixedArray } from 'memop';

export default class ScriptSystem extends System {
  constructor() {
    super();

    this._scripts = new FixedArray(200);
  }

  add(comp) {
    this._scripts.push(comp);
    comp.awake();

    // TODO: sort script by priority
  }

  remove(comp) {
    for (let i = 0; i < this._scripts.length; ++i) {
      let c = this._scripts.data[i];
      if (c === comp) {
        this._scripts.fastRemove(i);
        comp.end();
        break;
      }
    }
  }

  tick() {
    for (let i = 0; i < this._scripts.length; ++i) {
      let script = this._scripts.data[i];

      // skip if entity is not ready, or the component is destroyed, or is disabled
      if (script.destroyed || !script.enabled) {
        continue;
      }

      // start script
      if (script._startedFlag === 0) {
        script._startedFlag = 1;
        script.start();
        continue;
      }

      script.tick();
    }
  }

  postTick() {
    for (let i = 0; i < this._scripts.length; ++i) {
      let script = this._scripts.data[i];

      if (script._startedFlag === 1) {
        script._startedFlag = 2;
        continue;
      }

      // skip if entity is not ready, or the component is destroyed, or is disabled
      if (script.destroyed || !script.enabled) {
        continue;
      }

      script.postTick();
    }
  }
}