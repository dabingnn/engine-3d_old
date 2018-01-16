import { System } from 'ecs.js';
import { utils } from 'scene-graph';
import { vec3, mat4 } from 'vmath';
import { RecyclePool, FixedArray } from 'memop';
import { intersect } from 'geom-utils';
import MouseEvent from '../../events/mouse-event';
import KeyboardEvent from '../../events/keyboard-event';
import TouchEvent from '../../events/touch-event';
import ScreenRenderHelper from './screen-render-helper';

let _entities = new FixedArray(100);

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

    this._lastHoverEntity = null;
    this._lastFocusEntity = null;
    this._mouseEventPool = new RecyclePool(() => {
      return new MouseEvent('unknown');
    }, 8);
    this._keyboardEventPool = new RecyclePool(() => {
      return new KeyboardEvent('unknown');
    }, 8);
    this._touchEventPool = new RecyclePool(() => {
      return new TouchEvent('unknown');
    }, 8);
  }

  finalize() {
    this._screenRenderHelper = new ScreenRenderHelper(this._engine);
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
    this._mouseEventPool.reset();
    this._keyboardEventPool.reset();
    this._touchEventPool.reset();
    this._screenRenderHelper.reset();

    // collect all entities (used in input & layout)
    _entities.reset();
    for (let index = 0; index < this._screens.length; ++index) {
      let screen = this._screens[index];

      if (!screen.enabled) {
        continue;
      }

      // skipt nested screen
      let nested = false;
      let parent = screen._entity.parent;
      while (parent) {
        if (parent.getComp('Screen')) {
          nested = true;
          break;
        }
        parent = parent.parent;
      }
      if (nested) {
        continue;
      }

      utils.walk(screen._entity, ent => {
        _entities.push(ent);
      });
    }

    // process inputs
    this._processInputs(_entities);

    // process layout
    this._processLayout(_entities);

    // render screen elements (in the order of hierarchy)
    this._renderScreens();
  }

  _processInputs(entities) {
    const input = this._engine.input;
    let targetEnt = null;

    // ==========================
    // handle touches
    // ==========================

    if (input.hasTouch) {
      for (let i = 0; i < input.touchCount; ++i) {
        let touchInfo = input.getTouchInfo(i);
        targetEnt = _getWidgetAt(screen, entities, touchInfo.x, touchInfo.y);

        let touchEvent = this._touchEventPool.add();
        touchEvent.reset();
        touchEvent.dx = touchInfo.dx;
        touchEvent.dy = touchInfo.dy;
        touchEvent.x = touchInfo.x;
        touchEvent.y = touchInfo.y;
        touchEvent.target = targetEnt;

        if (touchInfo.phase === 'start') {
          touchEvent.name = 'touchstart';
          targetEnt.dispatch('touchstart', touchEvent);
        } else if (touchInfo.phase === 'pressing') {
          if (touchInfo.dx !== 0 || touchInfo.dy !== 0) {
            touchEvent.name = 'touchmove';
            targetEnt.dispatch('touchmove', touchEvent);
          }
        } else if (touchInfo.phase === 'end') {
          touchEvent.name = 'touchend';
          targetEnt.dispatch('touchend', touchEvent);
        } else if (touchInfo.phase === 'cancel') {
          touchEvent.name = 'touchcancel';
          targetEnt.dispatch('touchcancel', touchEvent);
        }
      }

      return;
    }

    // ==========================
    // handle mouse input
    // ==========================

    let mousedown = input.hasMouseDown;
    let mouseup = input.hasMouseUp;
    let mousemoved = input.mouseDeltaX !== 0 || input.mouseDeltaY !== 0;

    if (
      mousemoved || mousedown || mouseup
    ) {
      targetEnt = _getWidgetAt(screen, entities, input.mouseX, input.mouseY);
    }

    if (targetEnt) {
      // emit mousedown
      if (mousedown) {
        for (let i = 0; i < input._mousedowns.length; ++i) {
          let mousedownBtn = input._mousedowns.data[i];
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

          targetEnt.dispatch('mousedown', mouseEvent);
        }
      }

      // emit mouseup
      if (mouseup) {
        for (let i = 0; i < input._mouseups.length; ++i) {
          let mouseupBtn = input._mouseups.data[i];
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

          targetEnt.dispatch('mouseup', mouseEvent);
        }
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

        targetEnt.dispatch('mousemove', mouseEvent);
      }
    }

    // ==========================
    // handle focus
    // ==========================

    if (mousedown) {
      this._lastFocusEntity = targetEnt;
    }

    // ==========================
    // handle keyboard input
    // ==========================

    let keydown = input.hasKeyDown;
    let keyup = input.hasKeyUp;

    if (this._lastFocusEntity) {
      if (keydown) {
        for (let i = 0; i < input._keydowns.length; ++i) {
          let key = input._keydowns.data[i];
          let keyboardEvent = this._keyboardEventPool.add();
          keyboardEvent.reset();
          keyboardEvent.key = key;
          keyboardEvent.target = this._lastFocusEntity;

          targetEnt.dispatch('keydown', keyboardEvent);
        }
      }

      if (keyup) {
        for (let i = 0; i < input._keyups.length; ++i) {
          let key = input._keyups.data[i];
          let keyboardEvent = this._keyboardEventPool.add();
          keyboardEvent.reset();
          keyboardEvent.key = key;
          keyboardEvent.target = this._lastFocusEntity;

          targetEnt.dispatch('keyup', keyboardEvent);
        }
      }
    }
  }

  _processLayout(entities) {
    for (let i = 0; i < entities.length; ++i) {
      let entity = entities.data[i];

      let parent = entity.parent;
      let parentWidget = parent.getComp('Widget');
      let parentX = 0, parentY = 0;
      let parentWidth = 0, parentHeight = 0;

      // we are at root
      if (parentWidget === null) {
        // TODO:
        // let screen = parent.getComp('Screen');
        // width = screen.width;
        // height = screen.height;

        parentX = 0.0;
        parentY = 0.0;
        parentWidth = this._engine._canvas.width;
        parentHeight = this._engine._canvas.height;
      } else {
        parentX = parentWidget._rect.x;
        parentY = parentWidget._rect.y;
        parentWidth = parentWidget._rect.w;
        parentHeight = parentWidget._rect.h;
      }

      //
      let widget = entity.getComp('Widget');
      widget.calculate(parentX, parentY, parentWidth, parentHeight);
    }
  }

  _renderScreens() {
    for (let index = 0; index < this._screens.length; ++index) {
      let screen = this._screens[index];

      if (!screen.enabled) {
        continue;
      }

      // TODO: we don't need to do this all the time. Just do it when canvas resized.
      // reset view matrix
      let view = screen._view;
      let canvasWidth = this._engine._canvas.width;
      let canvasHeight = this._engine._canvas.height;
      mat4.ortho(view._matProj, 0, canvasWidth, 0, canvasHeight, -100, 100);
      mat4.copy(view._matViewProj, view._matProj);
      mat4.invert(view._matInvViewProj, view._matProj);
      view._rect.x = view._rect.y = 0;
      view._rect.w = canvasWidth;
      view._rect.h = canvasHeight;

      // reset screen states in renderer helper
      this._screenRenderHelper.resetScreen(screen);

      // render screen elements
      utils.walk2(screen._entity, entity => {
        let widget = entity.getComp('Widget');

        let mask = entity.getComp('Mask');
        if (mask && mask.enabled) {
          this._screenRenderHelper.pushMask(widget, mask);
        }

        let image = entity.getComp('Image');
        if (image && image.enabled) {
          this._screenRenderHelper.addImage(widget, image);
        }

        let text = entity.getComp('Text');
        if (text && text.enabled && text.font !== null) {
          this._screenRenderHelper.addText(widget, text);
        }

      }, entity => {
        let widget = entity.getComp('Widget');
        let mask = entity.getComp('Mask');
        if (mask && mask.enabled) {
          this._screenRenderHelper.popMask(widget, mask);
        }
      });
    }
  }
}