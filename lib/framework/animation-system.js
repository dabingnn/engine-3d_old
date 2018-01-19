import { System } from 'ecs.js';
import { FixedArray } from 'memop';

export default class AnimationSystem extends System {
  constructor() {
    super();

    this._anims = new FixedArray(200);
  }

  add(comp) {
    this._anims.push(comp);
  }

  remove(comp) {
    for (let i = 0; i < this._anims.length; ++i) {
      let c = this._anims.data[i];
      if (c === comp) {
        this._anims.fastRemove(i);
        break;
      }
    }
  }

  tick() {
    for (let i = 0; i < this._anims.length; ++i) {
      let anim = this._anims.data[i];
      anim._animCtrl.tick(this._app.deltaTime);
    }
  }
}