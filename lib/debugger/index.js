import { vec3, quat } from 'vmath';
import renderer from 'renderer.js';
import OrbitCamera from './orbit-camera';
import DrawMng from './draw-mng';
import { createGrid } from './utils';

export default class Debugger {
  /**
   * @param {App} app
   */
  constructor(app) {
    this._state = 'sleep';
    this._app = app;
    this._drawMng = new DrawMng(app);

    // debug camera
    this._orbit = new OrbitCamera(app._input);
    this._camera = new renderer.Camera();
    this._camera.setColor(0.3, 0.3, 0.3, 1);
    this._camera.setNode(this._orbit._node);

    // grid
    this._grid = createGrid(app.device, 100, 100, 100);
  }

  start() {
    if (this._state !== 'sleep') {
      return;
    }

    this._state = 'enter';
  }

  stop() {
    if (this._state === 'sleep') {
      return;
    }

    this._state = 'fade2normal';
  }

  tick() {
    if (this._state === 'sleep') {
      return;
    }

    let name = `_${this._state}`;
    let fn = this[name];
    if (!fn) {
      console.warn(`Unknown state ${this._state}`);
      return;
    }

    this[name]();
  }

  // ====================
  // debug draw
  // ====================

  drawLine(start, end, color, duration, depthTest) {
    this._drawMng.addLine(start, end, color, duration, depthTest);
  }

  // ====================
  // internal states
  // ====================

  _enter() {
    let mainCam = this._app.scene.getCamera(0);
    if (!mainCam) {
      return;
    }

    // setup debug camera
    vec3.copy(this._orbit._node.lpos, mainCam._node.lpos);
    quat.copy(this._orbit._node.lrot, mainCam._node.lrot);
    vec3.copy(this._orbit._node.lscale, mainCam._node.lscale);
    this._orbit.reset();
    this._app.scene.setDebugCamera(this._camera);

    //
    this._app.scene.addModel(this._grid);

    //
    this._state = 'fade2debug';
  }

  _fade2debug() {
    this._state = 'debug';
  }

  _debug() {
    let dt = this._app.deltaTime;

    // update orbit camera
    this._orbit.tick(dt);

    // update draw-mng
    this._drawMng.tick(dt);
  }

  _fade2normal() {
    this._state = 'exit';
  }

  _exit() {
    this._app.scene.removeModel(this._grid);

    // restore runtime states
    this._app.scene.setDebugCamera(null);

    this._state = 'sleep';
  }
}