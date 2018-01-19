import { System } from 'ecs.js';

export default class SkyboxSystem extends System {
  constructor() {
    super();
  }

  add(comp) {
    this._app.scene.addModel(comp._model);
  }

  remove(comp) {
    this._app.scene.removeModel(comp._model);
  }
}