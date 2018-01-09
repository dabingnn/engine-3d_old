import { System } from 'ecs.js';
import { utils } from 'scene-graph';
import { vec3, mat4 } from 'vmath';
import { RecyclePool, FixedArray } from 'memop';
import { intersect } from 'geom-utils';
import MouseEvent from '../../events/mouse-event';
import ScreenRenderHelper from './screen-render-helper';

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

export default class ScreenSystem extends System {
  constructor() {
    super();

    this._screens = [];
    this._screenRenderHelper = null;
    this._entities = new FixedArray(100);

    this._lastHoverEntity = null;
    this._mouseEventPool = new RecyclePool(() => {
      return new MouseEvent('unknown');
    }, 8);
  }

  finalize() {
    this._screenRenderHelper = new ScreenRenderHelper(this._engine._scene);
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
    let input = this._engine._input;
    this._mouseEventPool.reset();

    for (let index = 0; index < this._screens.length; ++index) {
      let screen = this._screens[index];

      if (!screen.enabled) {
        continue;
      }

      this._screenRenderHelper.reset();
      this._screenRenderHelper._scene = this._engine.scene;
      this._screenRenderHelper._screen = screen;

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

      utils.walk2(screenRoot, entity => {
        let widget = entity.getComp('Widget');

        let mask = entity.getComp('Mask');
        if (mask && mask.enabled) {
          // TODO
        }

        let image = entity.getComp('Image');
        if (image && image.enabled) {
          this._screenRenderHelper.addImage(widget, image);
        }

        let text = entity.getComp('Text');
        if (text && text.enabled) {
          this._screenRenderHelper.addText(widget, text);
        }

      }, entity => {
        let maskComp = entity.getComp('Mask');
        if (maskComp && maskComp.enabled) {
          // TODO
        }
      });

      // screenRenderer.beginScreen(screen);
      // utils.walk2(screenRoot, entity => {
      //   // todo change it if the interface changed in widget component
      //   let width = 1;
      //   let height = 1;
      //   let pivotX = 0.0;
      //   let pivotY = 0.0;
      //   let widgetComp = entity.getComp('Widget');
      //   if (widgetComp) {
      //     width = widgetComp._rect.w;
      //     height = widgetComp._rect.h;
      //     pivotX = widgetComp._pivotX;
      //     pivotY = widgetComp._pivotY;
      //   }

      //   let maskComp = entity.getComp('Mask');
      //   if (maskComp && maskComp.enabled) {
      //     let renderHelper = maskComp._renderHelper;
      //     renderHelper.width = width;
      //     renderHelper.height = height;
      //     renderHelper.pivotX = pivotX;
      //     renderHelper.pivotY = pivotY;
      //     renderHelper.updateModelData();
      //     this._stencilMgr.enterLevel();
      //     let setUpRenderData = renderHelper.getRenderData(0);
      //     if (setUpRenderData) {
      //       setUpRenderData.setStencil(gfx.DS_FUNC_NEVER, this._stencilMgr.stencilRef, this._stencilMgr.stencilWriteMask, gfx.STENCIL_OP_REPLACE,
      //         gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, this._stencilMgr.stencilWriteMask);
      //       screenRenderer.addItem(setUpRenderData);
      //     }
      //   }

      //   let spriteComp = entity.getComp('Sprite');
      //   if (spriteComp && spriteComp.enabled) {
      //     let renderHelper = spriteComp._renderHelper;
      //     renderHelper.width = width;
      //     renderHelper.height = height;
      //     renderHelper.pivotX = pivotX;
      //     renderHelper.pivotY = pivotY;
      //     renderHelper.updateModelData();
      //     for (let i = 0; i < renderHelper.getRenderDataCount(); ++i) {
      //       let renderData = renderHelper.getRenderData(i);
      //       renderData.setStencil(gfx.DS_FUNC_EQUAL, this._stencilMgr.stencilRef, this._stencilMgr.stencilRef, gfx.STENCIL_OP_KEEP,
      //         gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, 0);
      //       screenRenderer.addItem(renderData);
      //     }
      //   }

      //   let labelComp = entity.getComp('Label');
      //   if (labelComp && labelComp.enabled) {
      //     let renderHelper = labelComp._renderHelper;
      //     renderHelper.width = width;
      //     renderHelper.height = height;
      //     renderHelper.pivotX = pivotX;
      //     renderHelper.pivotY = pivotY;
      //     renderHelper.updateModelData();
      //     for (let i = 0; i < renderHelper.getRenderDataCount(); ++i) {
      //       let renderData = renderHelper.getRenderData(i);
      //       renderData.setStencil(gfx.DS_FUNC_EQUAL, this._stencilMgr.stencilRef, this._stencilMgr.stencilRef, gfx.STENCIL_OP_KEEP,
      //         gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, 0);
      //       screenRenderer.addItem(renderData);
      //     }
      //   }
      //   return true;
      // }, entity => {
      //   let maskComp = entity.getComp('Mask');
      //   if (maskComp && maskComp.enabled) {
      //     let clearRenderData = maskComp._renderHelper.getRenderData(1);
      //     if (clearRenderData) {
      //       clearRenderData.setStencil(gfx.DS_FUNC_NEVER, 0, this._stencilMgr.stencilWriteMask, gfx.STENCIL_OP_REPLACE,
      //         gfx.STENCIL_OP_KEEP, gfx.STENCIL_OP_KEEP, this._stencilMgr.stencilWriteMask);
      //       screenRenderer.addItem(clearRenderData);
      //     }
      //     this._stencilMgr.exitLevel();
      //   }
      // });

      // screenRenderer.endScreen();
    }
  }
}