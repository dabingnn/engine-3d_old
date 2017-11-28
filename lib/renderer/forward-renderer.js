import gfx from 'gfx.js';
import { vec3, mat4 } from 'vmath';
import { Pool, CircularPool } from 'memop';
import renderer from 'renderer.js';
import SkinningModel from './skinning-model';
import LinesModel from './lines-model';

const MAX_LINE_VERTS = 2000;

let _camPos = vec3.create();
let _camFwd = vec3.create();
let _v3_tmp1 = vec3.create();

let _a16_view = new Float32Array(16);
let _a16_proj = new Float32Array(16);
let _a16_viewProj = new Float32Array(16);
let _a3_camPos = new Float32Array(3);

let _lightOptions = [
  [],
  [{ id: 0 }],
  [{ id: 0 }, { id: 1 }],
  [{ id: 0 }, { id: 1 }, { id: 2 }],
  [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
];

let _lineData = new Float32Array(2000 * 6);

export default class ForwardRenderer extends renderer.Base {
  constructor(device, builtin) {
    super(device, builtin);
    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._sceneAmbient = new Float32Array([0.5, 0.5, 0.5]);

    this._registerStage('opaque', this._opaqueStage.bind(this));
    this._registerStage('transparent', this._transparentStage.bind(this));
    this._registerStage('2d', this._2dStage.bind(this));

    this._lineIAs = new CircularPool(() => {
      return new renderer.InputAssembler(
        new gfx.VertexBuffer(
          device,
          new gfx.VertexFormat([
            { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
            { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }
          ]),
          gfx.USAGE_DYNAMIC,
          _lineData,
          MAX_LINE_VERTS
        ),
        null,
        gfx.PT_LINES
      );
    }, 2);
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

  render(scene) {
    this._reset();

    // extract views from cameras, lights and so on
    const canvas = this._device._gl.canvas;

    if (scene._debugCamera) {
      let view = this._requestView();
      scene._debugCamera.extractView(view, canvas.width, canvas.height);
    } else {
      for (let i = 0; i < scene._cameras.length; ++i) {
        let view = this._requestView();
        scene._cameras.data[i].extractView(view, canvas.width, canvas.height);
      }
    }

    // update lights
    this.updateLights(scene);

    // render by cameras
    for (let i = 0; i < this._viewPools.length; ++i) {
      let view = this._viewPools.data[i];
      this._render(view, scene);
    }

    // render by views
    for (let i = 0; i < scene._views.length; ++i) {
      let view = scene._views[i];
      this._render(view, scene);
    }
  }

  _submitLightUniforms() {
    this._device.setUniform('sceneAmbient', this._sceneAmbient);

    if (this._directionalLights.length > 0) {
      for (let index = 0; index < this._directionalLights.length; ++index) {
        let light = this._directionalLights[index];
        this._device.setUniform(`dir_light${index}_direction`, light._directionUniform);
        this._device.setUniform(`dir_light${index}_color`, light._colorUniform);
      }
    }
    if (this._pointLights.length > 0) {
      for (let index = 0; index < this._pointLights.length; ++index) {
        let light = this._pointLights[index];
        this._device.setUniform(`point_light${index}_position`, light._positionUniform);
        this._device.setUniform(`point_light${index}_color`, light._colorUniform);
        this._device.setUniform(`point_light${index}_range`, light._range);
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
    }
  }

  _updateShaderOptions(items) {
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      let { model, options } = item;

      options.directionalLightSlots = _lightOptions[Math.min(4, this._directionalLights.length)];
      options.pointLightSlots = _lightOptions[Math.min(4, this._pointLights.length)];
      options.spotLightSlots = _lightOptions[Math.min(4, this._spotLights.length)];

      if (model instanceof SkinningModel) {
        model.updateMatrices();
        options.useSkinning = true;
      } else {
        options.useSkinning = false;
      }
    }
  }

  _draw(item) {
    const model = item.model;

    if (model instanceof SkinningModel) {
      this._device.setTexture('u_jointsTexture', model._jointsTexture, this._allocTextuerUnit());
      this._device.setUniform('u_jointsTextureSize', model._jointsTexture._width);
    }

    super._draw(item);
  }

  _2dStage(view, items) {
    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));

    // sort items
    items.sort((a, b) => {
      return a.model.sortKey - b.model.sortKey;
    });

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];

      if (item.model.dynamicIA) {
        this._drawDynamic(item);
      } else {
        this._draw(item);
      }
    }
  }

  _opaqueStage(view, items) {
    const programLib = this._programLib;
    view.getPosition(_camPos);

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('eye', vec3.array(_a3_camPos, _camPos));

    // update rendering
    this._submitLightUniforms();
    this._updateShaderOptions(items);

    // calculate sorting key
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      item.sortKey = programLib.getKey(
        item.technique._passes[0]._programName,
        item.options
      );
    }

    // sort items
    items.sort((a, b) => {
      let techA = a.technique;
      let techB = b.technique;

      if (techA._layer !== techB._layer) {
        return techA._layer - techB._layer;
      }

      if (techA._passes.length !== techB._passes.length) {
        return techA._passes.length - techB._passes.length;
      }

      return a.sortKey - b.sortKey;
    });

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];

      if (item.model.dynamicIA) {
        this._drawDynamic(item);
      } else {
        this._draw(item);
      }
    }
  }

  _transparentStage(view, items) {
    view.getPosition(_camPos);
    view.getForward(_camFwd);

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));
    this._device.setUniform('eye', vec3.array(_a3_camPos, _camPos));

    // calculate zdist
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];

      // TODO: we should use mesh center instead!
      item.node.getWorldPos(_v3_tmp1);

      vec3.sub(_v3_tmp1, _v3_tmp1, _camPos);
      item.sortKey = vec3.dot(_v3_tmp1, _camFwd);
    }

    // update rendering
    this._submitLightUniforms();
    this._updateShaderOptions(items);

    // sort items
    items.sort((a, b) => {
      if (a.technique._layer !== b.technique._layer) {
        return a.technique._layer - b.technique._layer;
      }

      return b.sortKey - a.sortKey;
    });

    // draw it
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      this._draw(item);
    }
  }

  _drawDynamic(item) {
    let model = item.model;
    let v = 0;

    if (model instanceof LinesModel) {
      for (let i = model.lines.length-1; i >= 0; --i) {
        // flush when verts exceeds
        if (v + 2 >= MAX_LINE_VERTS) {
          let lineIA = this._lineIAs.request();
          lineIA._vertexBuffer.update(0, _lineData);
          lineIA._start = 0;
          lineIA._count = i;

          item.ia = lineIA;
          this._draw(item);
          v = 0;
        }

        let line = model.lines.data[i];

        //
        let idx = v * 6;
        _lineData[idx] = line.start.x;
        _lineData[idx + 1] = line.start.y;
        _lineData[idx + 2] = line.start.z;
        _lineData[idx + 3] = line.color.r;
        _lineData[idx + 4] = line.color.g;
        _lineData[idx + 5] = line.color.b;

        _lineData[idx + 6] = line.end.x;
        _lineData[idx + 7] = line.end.y;
        _lineData[idx + 8] = line.end.z;
        _lineData[idx + 9] = line.color.r;
        _lineData[idx + 10] = line.color.g;
        _lineData[idx + 11] = line.color.b;

        v += 2;
      }

      // flush rest verts
      if (v > 0) {
        let lineIA = this._lineIAs.request();
        lineIA._vertexBuffer.update(0, _lineData);
        lineIA._start = 0;
        lineIA._count = v;

        item.ia = lineIA;
        this._draw(item);
      }
    }
  }
}