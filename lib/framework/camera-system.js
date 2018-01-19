import { System } from 'ecs.js';

export default class CameraSystem extends System {
  constructor() {
    super();
  }

  add(comp) {
    this._app.scene.addCamera(comp._camera);
  }

  remove(comp) {
    this._app.scene.removeCamera(comp._camera);
  }
}