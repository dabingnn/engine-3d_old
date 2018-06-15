import { System } from '../../ecs';
import { FixedArray } from '../../memop';

export default class UIElementSystem extends System {
  constructor() {
    super();
    this._uiElements = new FixedArray(200);
  }

  add(comp) {
    this._uiElements.push(comp);
  }

  remove(comp) {
    for (let i = 0; i < this._uiElements.length; ++i) {
      let c = this._uiElements.data[i];
      if (c === comp) {
        this._uiElements.fastRemove(i);
        break;
      }
    }
  }

  tick() {
    for (let i = 0; i < this._uiElements.length; ++i) {
      let uiElement = this._uiElements.data[i];
      if (uiElement && uiElement.tick) {
        uiElement.tick();
      }
    }
  }

  postTick() {
    for (let i = 0; i < this._uiElements.length; ++i) {
      let uiElement = this._uiElements.data[i];
      if (uiElement && uiElement.postTick) {
        uiElement.postTick();
      }
    }
  }
}