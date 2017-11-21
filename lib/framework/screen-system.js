import { System } from 'ecs.js';
import { Node, utils } from 'scene-graph';
import { vec3, mat4 } from 'vmath';
import gfx from 'gfx.js';
import { RecyclePool, FixedArray } from 'memop';
import renderer from 'renderer.js';
import { intersect } from 'geom-utils';
import MouseEvent from '../events/mouse-event';

// todo: those value could be changed
const _vertsInIAPool = 1024;
const _indicesInIAPool = 4096;
const _multiplyTransformVertexThreshold = 512;
// todo: this value is used for vec2 positon + vec2 uv + vec4 color
const _floatsPerVert = 8;
let _m4_tmp = mat4.create();
let _v3_tmp = vec3.create();

let _getWidgetAt = (function () {
  let p = vec3.create();
  let q = vec3.create();
  let a = vec3.create();
  let b = vec3.create();
  let c = vec3.create();
  let d = vec3.create();

  return function (screen, entities, x, y) {
    // TEMP DISABLE:
    // let view = screen._view;
    // let cx = view._rect.x;
    // let cy = view._rect.y;
    // let cw = view._rect.w;
    // let ch = view._rect.h;

    // // calculate screen pos in far clip plane
    // let wx = (x - cx) * 2.0 / cw - 1.0;
    // let wy = (y - cy) * 2.0 / ch - 1.0;
    // vec3.set(_v3_tmp, wx, wy, 0);

    // // transform to world
    // vec3.transformMat4(_v3_tmp, _v3_tmp, view._matInvViewProj);

    vec3.set(p, x, y, 1);
    vec3.set(q, x, y, -1);

    //
    for (let i = entities.length - 1; i >= 0; --i) {
      let ent = entities.data[i];
      let widget = ent.getComp('Widget');
      widget.getWorldCorners(a, b, c, d);

      if (intersect.line_quad(p, q, a, b, c, d)) {
        return ent;
      }
    }

    return null;
  };
})();

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
      if (multiplyTransform) {
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
      this._batchedVerts[(this._vertexOffset + i) * _floatsPerVert + 7] = color.a;
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

class _StencilManager {
  constructor() {
    // todo: 8 is least Stencil depth supported by webGL device, it could be adjusted to vendor implementation value
    this._maxLevel = 8;
    // 0 means current not in a mask
    this._currentLevel = 0;
  }

  enterLevel() {
    this._currentLevel++;
    if (this._currentLevel > this._maxLevel) {
      console.error(`Stencil manager does not support level bigger than ${this._maxLevel} in this device.`);
    }
  }

  exitLevel() {
    this._currentLevel--;
    if (this._currentLevel < 0) {
      console.error(`Exit too many mask levels`);
    }
  }

  get nestLevel() {
    return this._currentLevel;
  }

  get stencilWriteMask() {
    return 0x01 << (this._currentLevel - 1);
  }

  get stencilRef() {
    let result = 0;
    for (let i = 0; i < this._currentLevel; ++i) {
      result += (0x01 << i);
    }
    return result;
  }
}

export default class ScreenSystem extends System {
  constructor() {
    super();

    this._screens = [];
    this._stencilMgr = new _StencilManager();
    this._entities = new FixedArray(100);

    this._lastHoverEntity = null;
    this._mouseEventPool = new RecyclePool(() => {
      return new MouseEvent('unknown');
    }, 8);
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
    let input = this._engine._input;
    this._mouseEventPool.reset();

    for (let index = 0; index < this._screens.length; ++index) {
      let screen = this._screens[index];
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

      this._entities.reset();
      utils.walk(screenRoot, entity => {
        this._entities.push(entity);
      });

      // ==========================
      // handle mouse input
      // ==========================

      let targetEnt = null;
      let mousedownBtn = '';
      let mouseupBtn = '';
      let mousemoved = input.mouseDeltaX !== 0 || input.mouseDeltaY !== 0;

      // handle mousedown button
      if (input.mousedown('left')) {
        mousedownBtn = 'left';
      } else if (input.mousedown('right')) {
        mousedownBtn = 'right';
      } else if (input.mousedown('middle')) {
        mousedownBtn = 'middle';
      }

      // handle mouseup button
      if (input.mouseup('left')) {
        mouseupBtn = 'left';
      } else if (input.mouseup('right')) {
        mouseupBtn = 'right';
      } else if (input.mouseup('middle')) {
        mouseupBtn = 'middle';
      }

      //
      if (
        mousemoved ||
        mousedownBtn !== '' ||
        mouseupBtn !== ''
      ) {
        targetEnt = _getWidgetAt(screen, this._entities, input.mouseX, input.mouseY);
      }

      if (targetEnt) {
        // emit mousedown
        if (mousedownBtn !== '') {
          let mouseEvent = this._mouseEventPool.add();
          mouseEvent.reset();
          mouseEvent.name = 'mousedown';
          mouseEvent.dx = input.dx;
          mouseEvent.dy = input.dy;
          mouseEvent.mouseX = input.mouseX;
          mouseEvent.mouseY = input.mouseY;
          mouseEvent.target = targetEnt;
          mouseEvent.button = mousedownBtn;
          mouseEvent.buttons = input.mouseButtons;

          targetEnt.emit('mousedown', mouseEvent);
        }

        // emit mouseup
        if (mouseupBtn !== '') {
          let mouseEvent = this._mouseEventPool.add();
          mouseEvent.reset();
          mouseEvent.name = 'mouseup';
          mouseEvent.dx = input.dx;
          mouseEvent.dy = input.dy;
          mouseEvent.mouseX = input.mouseX;
          mouseEvent.mouseY = input.mouseY;
          mouseEvent.target = targetEnt;
          mouseEvent.button = mouseupBtn;
          mouseEvent.buttons = input.mouseButtons;

          targetEnt.emit('mouseup', mouseEvent);
        }
      }

      if (mousemoved) {
        if (this._lastHoverEntity !== targetEnt) {
          // emit mouseleave
          if (this._lastHoverEntity) {
            let mouseEvent = this._mouseEventPool.add();
            mouseEvent.reset();
            mouseEvent.name = 'mouseleave';
            mouseEvent.dx = input.dx;
            mouseEvent.dy = input.dy;
            mouseEvent.mouseX = input.mouseX;
            mouseEvent.mouseY = input.mouseY;
            mouseEvent.target = this._lastHoverEntity;
            mouseEvent.button = 0;
            mouseEvent.buttons = input.mouseButtons;

            this._lastHoverEntity.emit('mouseleave', mouseEvent);
          }

          // emit mouseenter
          if (targetEnt) {
            let mouseEvent = this._mouseEventPool.add();
            mouseEvent.reset();
            mouseEvent.name = 'mouseenter';
            mouseEvent.dx = input.dx;
            mouseEvent.dy = input.dy;
            mouseEvent.mouseX = input.mouseX;
            mouseEvent.mouseY = input.mouseY;
            mouseEvent.target = targetEnt;
            mouseEvent.button = 0;
            mouseEvent.buttons = input.mouseButtons;

            targetEnt.emit('mouseenter', mouseEvent);
          }

          this._lastHoverEntity = targetEnt;
        }

        // emit mousemove
        if (targetEnt) {
          let mouseEvent = this._mouseEventPool.add();
          mouseEvent.reset();
          mouseEvent.name = 'mousemove';
          mouseEvent.dx = input.dx;
          mouseEvent.dy = input.dy;
          mouseEvent.mouseX = input.mouseX;
          mouseEvent.mouseY = input.mouseY;
          mouseEvent.target = targetEnt;
          mouseEvent.button = 0;
          mouseEvent.buttons = input.mouseButtons;

          targetEnt.emit('mousemove', mouseEvent);
        }
      }

      // ==========================
      // layout screen elements
      // ==========================

      for (let i = 0; i < this._entities.length; ++i) {
        let entity = this._entities.data[i];

        // do nothing when we are at root
        if (entity === screenRoot) {
          continue;
        }

        let parent = entity.parent;
        let parentX = 0, parentY = 0;
        let parentWidth = 0, parentHeight = 0;

        if (parent === screenRoot) {
          // TODO:
          // let screen = parent.getComp('Screen');
          // width = screen.width;
          // height = screen.height;

          parentX = 0.0;
          parentY = 0.0;
          parentWidth = this._engine._canvas.width;
          parentHeight = this._engine._canvas.height;
        } else {
          let parentWidget = parent.getComp('Widget');
          parentX = parentWidget._rect.x;
          parentY = parentWidget._rect.y;
          parentWidth = parentWidget._rect.w;
          parentHeight = parentWidget._rect.h;
        }

        //
        let widget = entity.getComp('Widget');
        widget.calculate(parentX, parentY, parentWidth, parentHeight);
      }

      // ==========================
      // render screen elements
      // ==========================

      screenRenderer.beginScreen(screen);
      utils.walk2(screenRoot, entity => {
        // todo change it if the interface changed in widget component
        let width = 1;
        let height = 1;
        let pivotX = 0.0;
        let pivotY = 0.0;
        let widgetComp = entity.getComp('Widget');
        if (widgetComp) {
          width = widgetComp._rect.w;
          height = widgetComp._rect.h;
          pivotX = widgetComp._pivotX;
          pivotY = widgetComp._pivotY;
        }

        let maskComp = entity.getComp('Mask');
        if (maskComp) {
          let renderHelper = maskComp._renderHelper;
          renderHelper.width = width;
          renderHelper.height = height;
          renderHelper.pivotX = pivotX;
          renderHelper.pivotY = pivotY;
          renderHelper.updateModelData();
          this._stencilMgr.enterLevel();
          let setUpRenderData = renderHelper.getRenderData(0);
          if (setUpRenderData) {
            setUpRenderData.setStencil(gfx.DS_FUNC_NEVER, this._stencilMgr.stencilRef, this._stencilMgr.stencilWriteMask, gfx.STENCIL_OP_REPLACE,
              gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, this._stencilMgr.stencilWriteMask);
            screenRenderer.addItem(setUpRenderData);
          }
        }

        let spriteComp = entity.getComp('Sprite');
        if (spriteComp) {
          let renderHelper = spriteComp._renderHelper;
          renderHelper.width = width;
          renderHelper.height = height;
          renderHelper.pivotX = pivotX;
          renderHelper.pivotY = pivotY;
          renderHelper.updateModelData();
          for (let i = 0; i < renderHelper.getRenderDataCount(); ++i) {
            let renderData = renderHelper.getRenderData(i);
            renderData.setStencil(gfx.DS_FUNC_EQUAL, this._stencilMgr.stencilRef, this._stencilMgr.stencilRef, gfx.STENCIL_OP_KEEP,
              gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, 0);
            screenRenderer.addItem(renderData);
          }
        }

        let labelComp = entity.getComp('Label');
        if (labelComp) {
          let renderHelper = labelComp._renderHelper;
          renderHelper.width = width;
          renderHelper.height = height;
          renderHelper.pivotX = pivotX;
          renderHelper.pivotY = pivotY;
          renderHelper.updateModelData();
          for (let i = 0; i < renderHelper.getRenderDataCount(); ++i) {
            let renderData = renderHelper.getRenderData(i);
            renderData.setStencil(gfx.DS_FUNC_EQUAL, this._stencilMgr.stencilRef, this._stencilMgr.stencilRef, gfx.STENCIL_OP_KEEP,
              gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, 0);
            screenRenderer.addItem(renderData);
          }
        }
        return true;
      }, entity => {
        let maskComp = entity.getComp('Mask');
        if (maskComp) {
          let clearRenderData = maskComp._renderHelper.getRenderData(1);
          if (clearRenderData) {
            clearRenderData.setStencil(gfx.DS_FUNC_NEVER, 0, this._stencilMgr.stencilWriteMask, gfx.STENCIL_OP_REPLACE,
              gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, this._stencilMgr.stencilWriteMask);
            screenRenderer.addItem(clearRenderData);
          }
          this._stencilMgr.exitLevel();
        }
      });

      screenRenderer.endScreen();
    }
  }
}