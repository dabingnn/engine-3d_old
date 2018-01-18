import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import { color4, toDegree, toRadian } from 'vmath';

let _tmp_c0 = color4.create();
let _tmp_r0 = {
  x: -1, y: -1, w: -1, h: -1,
};

export default class CameraComponent extends Component {
  constructor() {
    super();

    this._camera = new renderer.Camera();
    this._camera.setStages([
      'opaque',
      'transparent'
    ]);
  }

  onInit() {
    this._camera.setNode(this._entity);
  }

  // projection ('ortho', 'perspective')
  get projection() {
    let type = this._camera.getType();

    if (type === renderer.PROJ_ORTHO) {
      return 'ortho';
    }

    return 'perspective';
  }
  set projection(val) {
    let type = renderer.PROJ_PERSPECTIVE;
    if (val === 'ortho') {
      type = renderer.PROJ_ORTHO;
    }
    this._camera.setType(type);
  }

  // fov (in angle)
  get fov() {
    return toDegree(this._camera.getFov());
  }
  set fov(val) {
    this._camera.setFov(toRadian(val));
  }

  // orthoHeight
  get orthoHeight() {
    return this._camera.getOrthoHeight();
  }
  set orthoHeight(val) {
    this._camera.setOrthoHeight(val);
  }

  // near
  get near() {
    return this._camera.getNear();
  }
  set near(val) {
    this._camera.setNear(val);
  }

  // far
  get far() {
    return this._camera.getFar();
  }
  set far(val) {
    this._camera.setFar(val);
  }

  // color
  get color() {
    return this._camera.getColor(_tmp_c0);
  }
  set color(val) {
    this._camera.setColor(val.r, val.g, val.b, val.a);
  }

  // depth
  get depth() {
    return this._camera.getDepth();
  }
  set depth(val) {
    this._camera.setDepth(val);
  }

  // stencil
  get stencil() {
    return this._camera.getStencil();
  }
  set stencil(val) {
    this._camera.setStencil(val);
  }

  // clearFlags
  get clearFlags() {
    return this._camera.getClearFlags();
  }
  set clearFlags(val) {
    this._camera.setClearFlags(val);
  }

  // rect
  get rect() {
    return this._camera.getRect(_tmp_r0);
  }
  set rect(val) {
    this._camera.setRect(val.x, val.y, val.w, val.h);
  }
}