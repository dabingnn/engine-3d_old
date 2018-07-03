// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { FixedArray } from '../../memop';
import { vec3 } from '../../vmath';
import { intersect } from '../../geom-utils';
import { Layers } from '../../scene-graph';

export default class Scene {
  constructor() {
    this._lights = new FixedArray(16);
    this._models = new FixedArray(16);
    this._cameras = new FixedArray(16);
    this._debugCamera = null;

    // NOTE: we don't use pool for views (because it's less changed and it doesn't have poolID)
    this._views = [];
  }

  _add(pool, item) {
    if (item._poolID !== -1) {
      return;
    }

    pool.push(item);
    item._poolID = pool.length - 1;
  }

  _remove(pool, item) {
    if (item._poolID === -1) {
      return;
    }

    pool.data[pool.length-1]._poolID = item._poolID;
    pool.fastRemove(item._poolID);
    item._poolID = -1;
  }

  reset() {
    for (let i = 0; i < this._models.length; ++i) {
      let model = this._models.data[i];
      model._viewID = -1;
    }
  }

  setDebugCamera(cam) {
    this._debugCamera = cam;
  }

  // camera

  getCameraCount() {
    return this._cameras.length;
  }

  getCamera(idx) {
    return this._cameras.data[idx];
  }

  addCamera(camera) {
    this._add(this._cameras, camera);
  }

  removeCamera(camera) {
    this._remove(this._cameras, camera);
  }

  // model

  getModelCount() {
    return this._models.length;
  }

  getModel(idx) {
    return this._models.data[idx];
  }

  addModel(model) {
    this._add(this._models, model);
  }

  removeModel(model) {
    this._remove(this._models, model);
  }

  raycast(hitInfo, ray, maxDistance = Infinity) {
    let dist = Infinity, cur = dist;
    // fixme: brute-force traversal
    let its = vec3.create();
    for (let i = 0; i < this.getModelCount(); i++) {
      let model = this.getModel(i);
      if (!Layers.check(model._node.layer, Layers.RaycastMask)) continue;
      if (!intersect.ray_box(ray, model._boundingBox, its)) continue;
      cur = vec3.sqrDist(its, ray.o);
      if (cur > maxDistance * maxDistance || cur > dist) continue;
      dist = cur;
      hitInfo.entity = model._node;
    }
    return dist < Infinity;
  }

  // light

  getLightCount() {
    return this._lights.length;
  }

  getLight(idx) {
    return this._lights.data[idx];
  }

  addLight(light) {
    this._add(this._lights, light);
  }

  removeLight(light) {
    this._remove(this._lights, light);
  }

  // view

  addView(view) {
    if (this._views.indexOf(view) === -1) {
      this._views.push(view);
    }
  }

  removeView(view) {
    let idx = this._views.indexOf(view);
    if (idx !== -1) {
      this._views.splice(idx, 1);
    }
  }
}