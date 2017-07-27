import { vec3, mat4 } from 'vmath';
import renderer from 'renderer.js';
import SkinningModel from './skinning-model';

let _camPos = vec3.create();
let _camFwd = vec3.create();
let _v3_tmp1 = vec3.create();

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);

export default class ForwardRenderer extends renderer.Base {
  constructor(device, builtin) {
    super(device, builtin);

    this._stage2fn[renderer.STAGE_OPAQUE] = this._opaqueStage.bind(this);
    this._stage2fn[renderer.STAGE_TRANSPARENT] = this._transparentStage.bind(this);
  }

  render(camera, scene) {
    this._reset();
    camera.updateMatrix();

    //
    this._render(camera, scene, [
      renderer.STAGE_OPAQUE,
      renderer.STAGE_TRANSPARENT,
    ]);
  }

  _updateSkinning(items) {
    // update effects for different models
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      let model = item.model;

      if (model instanceof SkinningModel) {
        model.updateMatrices();

        item.effect.setOption('useSkinning', true);
      }
    }
  }

  _draw(item) {
    const model = item.model;

    if (model instanceof SkinningModel) {
      this._device.setTexture('u_jointsTexture', model._jointsTexture, 3);
      this._device.setUniform('u_jointsTextureSize', model._jointsTexture._width);
    }

    super._draw(item);
  }

  _opaqueStage(camera, items) {
    const programLib = this._programLib;

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, camera._view));
    this._device.setUniform('proj', mat4.array(_a16_proj, camera._proj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, camera._viewProj));

    this._updateSkinning(items);

    // sort items
    items.sort((a, b) => {
      let techA = a.technique;
      let techB = b.technique;

      if (techA._layer !== techB._layer) {
        return techA._layer - techB._layer;
      }

      if (techA._passes.length !== techB._passes.length ) {
        return techA._passes.length - techB._passes.length;
      }

      let keyA = programLib.getKey(techA._passes[0]._programName, a.effect._options);
      let keyB = programLib.getKey(techB._passes[0]._programName, b.effect._options);

      return keyA - keyB;
    });

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      this._draw(item);
    }
  }

  _transparentStage(camera, items) {
    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, camera._view));
    this._device.setUniform('proj', mat4.array(_a16_proj, camera._proj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, camera._viewProj));

    this._updateSkinning(items);

    // calculate zdist
    camera._node.getWorldPos(_camPos);
    vec3.set(_camFwd, -camera._view.m02, -camera._view.m06, -camera._view.m10);

    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];

      // TODO: we should use mesh center instead!
      item.node.getWorldPos(_v3_tmp1);

      vec3.sub(_v3_tmp1, _v3_tmp1, _camPos);
      item.zdist = vec3.dot(_v3_tmp1, _camFwd);
    }

    // sort items
    items.sort((a, b) => {
      if (a.technique._layer !== b.technique._layer) {
        return a.technique._layer - b.technique._layer;
      }

      return b.zdist - a.zdist;
    });

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      this._draw(item);
    }
  }
}