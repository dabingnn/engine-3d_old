import { System } from 'ecs.js';
import { Node, utils } from 'scene-graph';
import { vec3, mat4 } from 'vmath';
import gfx from 'gfx.js';
import { Pool, RecyclePool } from 'memop';
import renderer from 'renderer.js';

// todo: those value could be changed
const _vertsInIAPool = 1024;
const _indicesInIAPool = 4096;
const _multiplyTransformVertexThreshold = 512;
// todo: this value is used for vec2 positon + vec2 uv + vec4 color
const _floatsPerVert = 8;
let _m4_tmp = mat4.create();
let _v3_tmp = vec3.create();

class _ScreenRendererHelper {
  constructor(app, submitCallback) {
    this._app = app;
    let device = app._device;
    // init vb and ib pool
    let fmt = [];
    fmt.push({ name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    fmt.push({ name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 });
    //todo: use UINT32 for color to optimise memory if it is needed
    fmt.push({ name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4 });
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

    this._dummyNode = new Node();
  }

  beginScreen(screen) {
    this._currentScreen = screen;
  }

  endScreen() {
    this._flush();
    this._currentScreen = null;
    this._sortKey = 0;
  }

  addItem(renderData) {
    // fast return
    if (!renderData || renderData.getVertexCount() === 0 || renderData.getIndexCount() === 0) {
      return;
    }
    let positions = renderData.getPositions();
    let uvs = renderData.getUVs();
    let color = renderData.getColor();
    let node = renderData.getNode();
    if (this._vb === null || this._ib === null) {
      this._vb = this._vbPool.add();
      this._ib = this._ibPool.add();
    }
    let ia = this._iaPool.add();
    node.getWorldMatrix(_m4_tmp);
    if (renderData.getVertexCount() + this._vertexOffset > _vertsInIAPool || renderData.getIndexCount() + this._indexOffset > _indicesInIAPool) {
      this._flush();
      this._vb = this._vbPool.add();
      this._ib = this._ibPool.add();
    }
    let multiplyTransform = renderData.getVertexCount() < _multiplyTransformVertexThreshold;
    for (let i = 0; i < renderData.getVertexCount(); ++i) {
      let position = positions[i];
      if(multiplyTransform) {
        vec3.transformMat4(_v3_tmp, positions[i], _m4_tmp);
        position = _v3_tmp;
      }
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert] = position.x;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 1] = position.y;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 2] = uvs[i].x;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 3] = uvs[i].y;

      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 4] = color.r;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 5] = color.g;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 6] = color.b;
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 6] = color.a;
    }
    let indices = renderData.getIndices();
    for (let i = 0; i < renderData.getIndexCount(); ++i) {
      this._batchedIndices[this._indexOffset + i] = indices[i] + this._vertexOffset;
    }
    renderData._ia = ia;
    renderData._multiplyTransform = multiplyTransform;
    this._batchedItems.push(renderData);
    ia._vertexBuffer = this._vb;
    ia._indexBuffer = this._ib;
    ia._start = this._indexOffset;
    ia._count = renderData.getIndexCount();
    this._vertexOffset = this._vertexOffset + renderData.getVertexCount();
    this._indexOffset = this._indexOffset + renderData.getIndexCount();
  }

  _flush() {
    if (this._batchedItems.length > 0) {
      this._vb.update(0, this._batchedVerts);
      this._ib.update(0, this._batchedIndices);
    }
    for (let i = 0; i < this._batchedItems.length; ++i) {
      let item = this._batchedItems[i];
      let nextItem = this._batchedItems[i + 1];
      if (nextItem && item.batchTest(nextItem)) {
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

  _submit(renderData) {
    let model = this._modelPool.add();
    this._usedModels.push(model);
    model.sortKey = this._sortKey++;
    model._viewID = this._currentScreen._view._id;
    model.setNode(renderData._multiplyTransform ? this._dummyNode : renderData.getNode());
    model.addEffect(renderData.getEffect());
    model.addInputAssembler(renderData._ia);
    this._app.scene.addModel(model);
  }

  reset() {
    this._iaPool.reset();
    this._vbPool.reset();
    this._ibPool.reset();
    let scene = this._app.scene;
    for (let i = 0; i < this._usedModels.length; ++i) {
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
    this._screenRendererHelper = new _ScreenRendererHelper(this._engine);
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
    let screenRenderer = this._screenRendererHelper;
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

      //
      let screenRoot = screen._entity;

      // layout screen elements
      utils.walk(screenRoot, entity => {
        // do nothing when we are at root
        if (entity === screenRoot) {
          return true;
        }

        let parent = entity.parent;
        let width = 0, height = 0;
        let pivotX = 0.5, pivotY = 0.5;

        if (parent === screenRoot) {
          // TODO:
          // let screen = parent.getComp('Screen');
          // width = screen.width;
          // height = screen.height;

          pivotX = 0.0;
          pivotY = 0.0;
          width = this._engine._canvas.width;
          height = this._engine._canvas.height;
        } else {
          let parentWidget = parent.getComp('Widget');
          pivotX = parentWidget.pivotX;
          pivotY = parentWidget.pivotY;
          width = parentWidget.width;
          height = parentWidget.height;
        }

        //
        let widget = entity.getComp('Widget');
        widget.calculate(pivotX, pivotY, width, height);

        return true;
      });

      utils.walk(screenRoot, entity => {
        let spriteComp = entity.getComp('Sprite');
        if (spriteComp) {
          let renderHelper = spriteComp._renderHelper;
          renderHelper.updateModelData();
          for (let i = 0; i < renderHelper.getRenderDataCount(); ++i) {
            screenRenderer.addItem(renderHelper.getRenderData(i));
          }
        }

        let labelComp = entity.getComp('Label');
        if (labelComp) {
          let renderHelper = labelComp._renderHelper;
          renderHelper.updateModelData();
          for (let i = 0; i < renderHelper.getRenderDataCount(); ++i) {
            screenRenderer.addItem(renderHelper.getRenderData(i));
          }
        }
        return true;
      });

      screenRenderer.endScreen();
    }
  }
}