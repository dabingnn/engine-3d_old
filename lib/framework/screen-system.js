import { System } from 'ecs.js';
import { utils } from 'scene-graph';

export default class ScreenSystem extends System {
  constructor() {
    super();
    this._screens = [];
  }

  add(comp) {
    this._screens.push(comp);
  }

  remove(comp) {
    let idx = this._screens.indexOf(comp);
    if (idx !== -1) {
      this._screens.splice(idx, 1);
    }
  }

  tick() {
    for (let index = 0; index < this._screens.length; ++index) {
      let screens = this._screens[index];
      let screenRoot = screens._entity;
      let sortKey = 0;
      utils.walk(screenRoot, entity => {
        let spriteComp = entity.getComp('Sprite');
        if (spriteComp) {
          spriteComp.updateModelData(true);
          spriteComp._model.sortKey = sortKey;
        }
        ++sortKey;
        return true;
      });

    }
  }
}