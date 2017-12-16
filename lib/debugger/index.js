import { vec3, quat, mat4 } from 'vmath';
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
    this._camera.setStages([
      'opaque',
      'transparent'
    ]);

    // debug view
    this._view2D = new renderer.View();
    this._view2D._clearFlags = 0;
    this._view2D._cullingByID = true;
    this._view2D._stages = [
      'opaque'
    ];

    // grid
    this._grid = createGrid(app, 100, 100, 100);
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

  commit() {
    let dt = this._app.deltaTime;

    // update draw-mng
    this._drawMng.tick(dt, this._view2D._id);
  }

  // ====================
  // debug draw
  // ====================

  drawLine(start, end, color, duration, depthTest) {
    this._drawMng.addLine(start, end, color, duration, depthTest, false);
  }

  drawLine2D(start, end, color, duration) {
    this._drawMng.addLine(start, end, color, duration, false, true);
  }

  drawRect(x, y, w, h, color, duration) {
    this._drawMng.addRect2D(x, y, w, h, color, duration);
  }

  drawAxes(pos, rotation, scale, duration, depthTest) {
    this._drawMng.addAxes(pos, rotation, scale, duration, depthTest, false);
  }

  drawAxes2D(pos, rotation, scale, duration) {
    this._drawMng.addAxes(pos, rotation, scale, duration, false, true);
  }

  drawSphere(pos, radius, color, duration, depthTest) {
    this._drawMng.addSphere(pos, radius, color, duration, depthTest);
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
    this._app.scene.addView(this._view2D);

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
    let canvasWidth = this._app._canvas.width;
    let canvasHeight = this._app._canvas.height;

    // update orbit camera
    this._orbit.tick(dt);

    // update view
    mat4.ortho(this._view2D._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
    mat4.copy(this._view2D._matViewProj, this._view2D._matProj);
    mat4.invert(this._view2D._matInvViewProj, this._view2D._matProj);
    this._view2D._rect.x = this._view2D._rect.y = 0;
    this._view2D._rect.w = canvasWidth;
    this._view2D._rect.h = canvasHeight;
  }

  _fade2normal() {
    this._state = 'exit';
  }

  _exit() {
    this._app.scene.removeModel(this._grid);

    // restore runtime states
    this._app.scene.setDebugCamera(null);

    //
    this._app.scene.removeView(this._view2D);

    this._state = 'sleep';
  }
}