import { System } from 'ecs.js';

export default class LightSystem extends System {
  constructor() {
    super();
  }

  add(comp) {
    this._engine.scene.addLight(comp._light);
  }

  remove(comp) {
    this._engine.scene.removeLight(comp._light);
  }
}