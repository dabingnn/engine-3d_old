// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { vec3, color4, mat4 } from 'vmath';
import enums from '../enums';
import { plane } from '../../geom-utils';

let _m4_tmp = mat4.create();
let _genID = 0;

export default class View {
  constructor() {
    this._id = _genID++;

    // priority. the smaller one will be rendered first
    this._priority = 0;

    // viewport
    this._rect = {
      x: 0, y: 0, w: 1, h: 1
    };

    // TODO:
    // this._scissor = {
    //   x: 0, y: 0, w: 1, h: 1
    // };

    // clear options
    this._color = color4.new(0.3, 0.3, 0.3, 1);
    this._depth = 1;
    this._stencil = 1;
    this._clearFlags = enums.CLEAR_COLOR | enums.CLEAR_DEPTH;

    // matrix
    this._matView = mat4.create();
    this._matProj = mat4.create();
    this._matViewProj = mat4.create();
    this._matInvViewProj = mat4.create();

    // stages & framebuffer
    this._stages = [];
    this._cullingByID = false;
    this._framebuffer = null;

    this._shadowLight = null; // TODO: should not refer light in view.

    this._frustumPlanes = new Array(6); // 0: left, 1: right, 2: bottom, 3: top, 4: near, 5: far
    for (let i = 0; i < 6; ++i) {
      this._frustumPlanes[i] = plane.create();
    }
  }

  getForward(out) {
    return vec3.set(
      out,
      -this._matView.m02,
      -this._matView.m06,
      -this._matView.m10
    );
  }

  getPosition(out) {
    mat4.invert(_m4_tmp, this._matView);
    return mat4.getTranslation(out, _m4_tmp);
  }

  updateFrustumPlanes() {
    // extract frustum planes from view-proj matrix.
    let m = this._matViewProj;

    // left plane
    vec3.set(this._frustumPlanes[0].n, m.m03 + m.m00, m.m07 + m.m04, m.m11 + m.m08);
    this._frustumPlanes[0].d = -(m.m15 + m.m12);
    // right plane
    vec3.set(this._frustumPlanes[1].n, m.m03 - m.m00, m.m07 - m.m04, m.m11 - m.m08);
    this._frustumPlanes[1].d = -(m.m15 - m.m12);
    // bottom plane
    vec3.set(this._frustumPlanes[2].n, m.m03 + m.m01, m.m07 + m.m05, m.m11 + m.m09);
    this._frustumPlanes[2].d = -(m.m15 + m.m13);
    // top plane
    vec3.set(this._frustumPlanes[3].n, m.m03 - m.m01, m.m07 - m.m05, m.m11 - m.m09);
    this._frustumPlanes[3].d = -(m.m15 - m.m13);
    // near plane
    vec3.set(this._frustumPlanes[4].n, m.m03 + m.m02, m.m07 + m.m06, m.m11 + m.m10);
    this._frustumPlanes[4].d = -(m.m15 + m.m14);
    // far plane
    vec3.set(this._frustumPlanes[5].n, m.m03 - m.m02, m.m07 - m.m06, m.m11 - m.m10);
    this._frustumPlanes[5].d = -(m.m15 - m.m14);

    // Note: now no need to normalize planes, if you need to know the true distance to the plane, please normalize it.
  }
}