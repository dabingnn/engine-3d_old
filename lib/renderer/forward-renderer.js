import gfx from 'gfx.js';
import { vec3, mat4 } from 'vmath';
import renderer from 'renderer.js';
import SkinningModel from './skinning-model';
import { Pool, CircularPool } from 'memop';

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

let _v3_tmp = vec3.create();
let _m4_tmp = mat4.create();
const _vertsInIAPool = 512;
const _indicesInIAPool = 2048;
const _floatsPerVert = 4;

class SpriteBatcher {
  constructor(render) {
    let device = render._device;
    this._renderer = render;
    // init vb and ib pool
    let fmt = [];
    fmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    fmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    this._vbPool = new CircularPool(() => {
      return new gfx.VertexBuffer(device, new gfx.VertexFormat(fmt), gfx.USAGE_STATIC, null, _vertsInIAPool);
    }, 3);
    this._ibPool = new CircularPool(() => {
      return new gfx.IndexBuffer(device, gfx.INDEX_FMT_UINT16, gfx.USAGE_STATIC, null, _indicesInIAPool);
    }, 3);
    this._vb = null;
    this._ib = null;
    this._allocNewVBIB();
    this._iaPool = new Pool(() => {
      return new renderer.InputAssembler(null, null);
    }, 8);
    this._vertexOffset = 0;
    this._indexOffset = 0;
    this._batchedItems = [];
    this._batchedVerts = new Float32Array(_vertsInIAPool * _floatsPerVert);
    this._batchedIndices = new Uint16Array(_indicesInIAPool);
  }

  addItem(item) {
    let data = item.model._modelData;
    let ia = this._iaPool.alloc();
    let node = item.node;
    node.getWorldMatrix(_m4_tmp);
    item.ia = ia;
    if (data.positions.length + this._vertexOffset > _vertsInIAPool || data.indices.length + this._indexOffset > _indicesInIAPool) {
      this.flush();
    }
    for (let i = 0; i < data.positions.length; ++i) {
      vec3.transformMat4(_v3_tmp, data.positions[i], _m4_tmp);
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert] = _v3_tmp.x;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 1] = _v3_tmp.y;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 2] = data.uvs[i].x;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 3] = data.uvs[i].y;
    }
    for (let i = 0; i < data.indices.length; ++i) {
      this._batchedIndices[this._indexOffset + i] = data.indices[i] + this._vertexOffset;
    }
    this._batchedItems.push(item);
    ia._vertexBuffer = this._vb;
    ia._indexBuffer = this._ib;
    ia._start = this._indexOffset;
    ia._count = data.indices.length;
    this._vertexOffset = this._vertexOffset + data.positions.length;
    this._indexOffset = this._indexOffset + data.indices.length;
  }

  _allocNewVBIB() {
    this._vb = this._vbPool.request();
    this._ib = this._ibPool.request();
  }

  _freeeVBIB() {
    this._vb = null;
    this._ib = null;
  }

  flush() {
    if (this._batchedItems.length > 0) {
      this._vb.update(0, this._batchedVerts);
      this._ib.update(0, this._batchedIndices);
    }
    for (let i = 0; i < this._batchedItems.length; ++i) {
      let item = this._batchedItems[i];
      let nextItem = this._batchedItems[i + 1];
      if (nextItem && nextItem.model.effect === item.effect) {
        // do batch
        nextItem.ia._start = item.ia._start;
        nextItem.ia._count = nextItem.ia._count + item.ia._count;
      } else {
        this._renderer._draw(item);
      }
      this._iaPool.free(item.ia);
      item.ia = null;
    }
    this._freeeVBIB();
    this._batchedItems.length = 0;
    this._vertexOffset = this._indexOffset = 0;
    this._allocNewVBIB();
  }
}

export default class ForwardRenderer extends renderer.Base {
  constructor(device, builtin) {
    super(device, builtin);
    this._directionalLights = [];
    this._pointLights = [];
    this._spotLights = [];
    this._sceneAmbient = new Float32Array([0.5, 0.5, 0.5]);
    this._stage2fn[renderer.STAGE_OPAQUE] = this._opaqueStage.bind(this);
    this._stage2fn[renderer.STAGE_TRANSPARENT] = this._transparentStage.bind(this);
    this._stage2fn[renderer.STAGE_2D] = this._2dStage.bind(this);
    this._batcher = new SpriteBatcher(this);
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

    // hack 2d view
    let view2D = this._requestView();
    mat4.ortho(view2D._matProj, 0, canvas.width, 0, canvas.height, -100, 100);
    mat4.copy(view2D._matViewProj, view2D._matProj);
    mat4.invert(view2D._matInvViewProj, view2D._matProj);
    view2D._rect.x = view2D._rect.y = 0;
    view2D._rect.w = canvas.width;
    view2D._rect.h = canvas.height;
    view2D._clearFlags = 0;

    // update lights
    this.updateLights(scene);

    // render by views
    for (let i = 0; i < this._viewPools.length; ++i) {
      let view = this._viewPools.data[i];
      // hack 2d view
      if (view == view2D) {
        this._render(view, scene, [
          renderer.STAGE_2D,
        ]);
      } else {
        this._render(view, scene, [
          renderer.STAGE_OPAQUE,
          renderer.STAGE_TRANSPARENT,
        ]);
      }
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
      // TODO: set joint texture to slot 7 temperarily, we should remove specify slot when set textures
      this._device.setTexture('u_jointsTexture', model._jointsTexture, 7);
      this._device.setUniform('u_jointsTextureSize', model._jointsTexture._width);
    }

    super._draw(item);
  }

  _2dStage(view, items) {
    const programLib = this._programLib;

    // update uniforms
    this._device.setUniform('view', mat4.array(_a16_view, view._matView));
    this._device.setUniform('proj', mat4.array(_a16_proj, view._matProj));
    this._device.setUniform('viewProj', mat4.array(_a16_viewProj, view._matViewProj));

    // sort items
    items.sort((a, b) => {
      return a.model.sortKey - b.model.sortKey;
    });

    let batcher = this._batcher;
    for (let i = 0; i < items.length; ++i) {
      let item = items.data[i];
      batcher.addItem(item);
    }

    batcher.flush();
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
      this._draw(item);
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
}