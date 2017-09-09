import { System } from 'ecs.js';

export default class CameraSystem extends System {
  constructor() {
    super();
  }

  add(comp) {
    this._engine.scene.addCamera(comp._camera);
  }

  remove(comp) {
    this._engine.scene.removeCamera(comp._camera);
  }
}