import { System } from 'ecs.js';
import { utils } from 'scene-graph';
import { vec3, mat4 } from 'vmath';
import gfx from 'gfx.js';
import { Pool, RecyclePool } from 'memop';
import renderer from 'renderer.js';

const _vertsInIAPool = 512;
const _indicesInIAPool = 2048;
const _floatsPerVert = 4;
let _m4_tmp = mat4.create();
let _v3_tmp = vec3.create();

class ScreenRenderer {
  constructor(app, submitCallback) {
    this._app = app;
    let device = app._device;
    // init vb and ib pool
    let fmt = [];
    fmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    fmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    this._vbPool = new RecyclePool(() => {
      return new gfx.VertexBuffer(device, new gfx.VertexFormat(fmt), gfx.USAGE_STATIC, null, _vertsInIAPool);
    }, 3);
    this._ibPool = new RecyclePool(() => {
      return new gfx.IndexBuffer(device, gfx.INDEX_FMT_UINT16, gfx.USAGE_STATIC, null, _indicesInIAPool);
    }, 3);
    this._iaPool = new RecyclePool(() => {
      return new renderer.InputAssembler(null, null);
    }, 8);

    this._modelPool = new RecyclePool(() => {
      return new renderer.Model();
    }, 8);
    this._usedModels = [];

    this._vb = null;
    this._ib = null;
    this._vertexOffset = 0;
    this._indexOffset = 0;
    this._batchedItems = [];
    this._batchedVerts = new Float32Array(_vertsInIAPool * _floatsPerVert);
    this._batchedIndices = new Uint16Array(_indicesInIAPool);
    this._submitCallback = submitCallback;
    this._currentScreen = null;
    this._sortKey = 0;
  }

  beginScreen(screen) {
    this._currentScreen = screen;
  }

  endScreen() {
    this._flush();
    this._currentScreen = null;
    this._sortKey = 0;
  }

  addItem(item) {
    let positions = item.positions;
    let uvs = item.uvs;
    let node = item._component._entity;
    if (item.vertexCount === 0 || item.indexCount === 0) {
      return;
    }
    if (this._vb === null || this._ib === null) {
      this._vb = this._vbPool.add();
      this._ib = this._ibPool.add();
    }
    let ia = this._iaPool.add();
    node.getWorldMatrix(_m4_tmp);
    if (item.vertexCount + this._vertexOffset > _vertsInIAPool || item.indexCount + this._indexOffset > _indicesInIAPool) {
      this._flush();
    }
    for (let i = 0; i < item.vertexCount; ++i) {
      vec3.transformMat4(_v3_tmp, positions[i], _m4_tmp);
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert] = _v3_tmp.x;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 1] = _v3_tmp.y;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 2] = uvs[i].x;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 3] = uvs[i].y;
    }
    for (let i = 0; i < item.indexCount; ++i) {
      this._batchedIndices[this._indexOffset + i] = item._indices[i] + this._vertexOffset;
    }
    item._ia = ia;
    this._batchedItems.push(item);
    ia._vertexBuffer = this._vb;
    ia._indexBuffer = this._ib;
    ia._start = this._indexOffset;
    ia._count = item.indexCount;
    this._vertexOffset = this._vertexOffset + item.vertexCount;
    this._indexOffset = this._indexOffset + item.indexCount;
  }

  _flush() {
    if (this._batchedItems.length > 0) {
      this._vb.update(0, this._batchedVerts);
      this._ib.update(0, this._batchedIndices);
    }
    for (let i = 0; i < this._batchedItems.length; ++i) {
      let item = this._batchedItems[i];
      let nextItem = this._batchedItems[i + 1];
      if (nextItem && nextItem._texture === item._texture) {
        // do batch
        nextItem._ia._start = item._ia._start;
        nextItem._ia._count = nextItem._ia._count + item._ia._count;
      } else {
        this._submit(item);
      }
      item._ia = null;
    }
    this._vb = null;
    this._ib = null;
    this._batchedItems.length = 0;
    this._vertexOffset = this._indexOffset = 0;
  }

  _submit(item) {
    let model = this._modelPool.add();
    model.sortKey = this._sortKey++;
    model._viewID = this._currentScreen._view._id;
    model.setNode(item._component._entity);
    model.addEffect(item._component._material._effect);
    model.addInputAssembler(item._ia);
    this._app.scene.addModel(model);
  }

  reset() {
    this._iaPool.reset();
    this._vbPool.reset();
    this._ibPool.reset();
    let scene = this._app.scene;
    for(let i = 0; i < this._usedModels.length; ++i) {
      // remove from scene
      this._usedModels[i].clearInputAssemblers();
      this._usedModels[i].clearEffects();
      scene.removeModel(this._usedModels[i]);
    }
    this._modelPool.reset();
    this._usedModels.length = 0;
  }
}

export default class ScreenSystem extends System {
  constructor() {
    super();
    this._screens = [];
  }

  finalize() {
    this._screenRenderer = new ScreenRenderer(this._engine);
  }

  add(comp) {
    this._screens.push(comp);
    this._engine.scene.addView(comp._view);
  }

  remove(comp) {
    let idx = this._screens.indexOf(comp);
    if (idx !== -1) {
      this._screens.splice(idx, 1);
      this._engine.scene.removeView(comp._view);
    }
  }

  tick() {
    let screenRenderer = this._screenRenderer;
    screenRenderer.reset();
    for (let index = 0; index < this._screens.length; ++index) {
      let screen = this._screens[index];
      screenRenderer.beginScreen(screen);
      let view = screen._view;

      // setup view matrix
      let canvasWidth = this._engine._canvas.width;
      let canvasHeight = this._engine._canvas.height;

      mat4.ortho(view._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
      mat4.copy(view._matViewProj, view._matProj);
      mat4.invert(view._matInvViewProj, view._matProj);
      view._rect.x = view._rect.y = 0;
      view._rect.w = canvasWidth;
      view._rect.h = canvasHeight;

      // sort sprite, update model and setup viewID
      let screenRoot = screen._entity;
      let sortKey = 0;

      utils.walk(screenRoot, entity => {
        let spriteComp = entity.getComp('Sprite');
        if (spriteComp) {
          spriteComp._model.updateModelData();
          spriteComp._model.sortKey = sortKey++;
          spriteComp._model._viewID = view._id;
          screenRenderer.addItem(spriteComp._model);
        }
        let labelComp = entity.getComp('Label');
        if (labelComp) {
          labelComp._model.updateModelData();
          labelComp._model.sortKey = sortKey++;
          labelComp._model._viewID = view._id;
          screenRenderer.addItem(labelComp._model);
        }
        return true;
      });

      screenRenderer.endScreen();
    }
  }
}