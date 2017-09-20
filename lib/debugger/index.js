import renderer from 'renderer.js';
import OrbitCamera from './orbit-camera';
import { createGrid } from './utils';

export default class Debugger {
  constructor(app) {
    this._enabled = false;
    this._app = app;

    // debug camera
    this._orbit = new OrbitCamera(app._input);
    this._camera = new renderer.Camera();
    this._camera.setColor(0.3, 0.3, 0.3, 1);
    this._camera.setNode(this._orbit._node);

    // grid
    this._grid = createGrid(app.device, 100, 100, 100);
  }

  start(pos, lookAt) {
    if (this._enabled) {
      return;
    }

    this._enabled = true;
    this._orbit.set(pos, lookAt);

    this._app.scene.addCamera(this._camera);
    this._app.scene.addModel(this._grid);
  }

  stop() {
    if (!this._enabled) {
      return;
    }
    this._enabled = false;

    this._app.scene.removeCamera(this._camera);
    this._app.scene.removeModel(this._grid);
  }

  tick(dt) {
    if (!this._enabled) {
      return;
    }

    // update orbit camera
    this._orbit.tick(dt);
  }
}