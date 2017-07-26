import { vec3, mat4 } from 'vmath';
import renderer from 'renderer.js';

let _camPos = vec3.create();
let _camFwd = vec3.create();
let _v3_tmp1 = vec3.create();

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);

let _lightOptions = {
  '0': [],
  '1': [0],
  '2': [0, 1],
  '3': [0, 1, 2],
  '4': [0, 1, 2, 3],
};

export default class ForwardRenderer extends renderer.Base {
  constructor(device, builtin) {
    super(device, builtin);
    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._stage2fn[renderer.STAGE_OPAQUE] = this._opaqueStage.bind(this);
    this._stage2fn[renderer.STAGE_TRANSPARENT] = this._transparentStage.bind(this);
  }

  updateLights(scene) {
    this._directionalLights.length = 0;
    this._pointLights.length = 0;
    this._spotLights.length = 0;
    let lights = scene._lights;
    for (let i = 0; i < lights.length; ++i) {
      let light = lights.data[i];
      light.update();
      if (light._type === renderer.LIGHT_DIRECTIONAL) {
        this._directionalLights.push(light);
      } else if (light._type === renderer.LIGHT_POINT) {
        this._pointLights.push(light);
      } else {
        this._spotLights.push(light);
      }

    }
  }

  render(camera, scene) {
    this._reset();
    this.updateLights(scene);
    camera.updateMatrix();

    this._render(camera, scene, [
      renderer.STAGE_OPAQUE,
      renderer.STAGE_TRANSPARENT,
    ]);
  }
  
  _updateRenderingOptions(items) {
    if (this._directionalLights.length > 0) {
      for (let index = 0; index < this._directionalLights.length; ++index) {
        let light = this._directionalLights[index];
        this._device.setUniform(`dir_light${index}_direction`, light._directionUniform);
        this._device.setUniform(`dir_light${index}_color`, light._colorUniform);
      }

      for (let i = 0; i < items.length; ++i) {
        let item = items.data[i];
        item.effect.setOption('directionalLightSlots', _lightOptions[Math.min(4, this._directionalLights.length)]);
      }
    }
    if (this._pointLights.length > 0) {
      for (let index = 0; index < this._pointLights.length; ++index) {
        let light = this._pointLights[index];
        this._device.setUniform(`point_light${index}_position`, light._positionUniform);
        this._device.setUniform(`point_light${index}_color`, light._colorUniform);
        this._device.setUniform(`point_light${index}_range`, light._range);
      }

      for (let i = 0; i < items.length; ++i) {
        let item = items.data[i];
        item.effect.setOption('pointLightSlots', _lightOptions[Math.min(4, this._pointLights.length)]);
      }
    }

    if (this._spotLights.length > 0) {
      for (let index = 0; index < this._spotLights.length; ++index) {
        let light = this._spotLights[index];
        this._device.setUniform(`spot_light${index}_position`, light._positionUniform);
        this._device.setUniform(`spot_light${index}_direction`, light._directionUniform);
        this._device.setUniform(`spot_light${index}_color`, light._colorUniform);
        this._device.setUniform(`spot_light${index}_range`, light._range);
        this._device.setUniform(`spot_light${index}_spot`, light._spotUniform);
      }

      for (let i = 0; i < items.length; ++i) {
        let item = items.data[i];
        item.effect.setOption('spotLightSlots', _lightOptions[Math.min(4, this._spotLights.length)]);
      }
    }
  }
  _opaqueStage(camera, items) {
    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, camera._view));
    this._device.setUniform('proj', mat4.array(_a16_proj, camera._proj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, camera._viewProj));

    // update effect options
    this._updateRenderingOptions(items);

    // sort items
    items.sort((a, b) => {
      if (a.technique._layer !== b.technique._layer) {
        return a.technique._layer - b.technique._layer;
      }

      return 0;
      // TODO: a.material.getKey() - b.material.getKey();
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

    // update effect options
    this._updateRenderingOptions(items);

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