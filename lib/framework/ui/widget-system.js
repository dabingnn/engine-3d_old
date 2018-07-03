import { System } from '../../ecs';
import { utils } from '../../scene-graph';
import { vec3, mat4 } from '../../vmath';
import { RecyclePool, FixedArray } from '../../memop';
import { intersect } from '../../geom-utils';
import MouseEvent from '../../events/mouse-event';
import KeyboardEvent from '../../events/keyboard-event';
import TouchEvent from '../../events/touch-event';
import FocusEvent from '../../events/focus-event';
import ScreenRenderHelper from './screen-render-helper';

let _entities = new FixedArray(100);
let _mouseBtns = ['left', 'middle', 'right'];

let _getWidgetAt = (function () {
  let p = vec3.zero();
  let q = vec3.zero();
  let a = vec3.zero();
  let b = vec3.zero();
  let c = vec3.zero();
  let d = vec3.zero();

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
    // _v3_tmp.set( wx, wy, 0);

    // // transform to world
    // vec3.transformMat4(_v3_tmp, _v3_tmp, view._matInvViewProj);

    p.set( x, y, 1);
    q.set( x, y, -1);

    //
    for (let i = entities.length - 1; i >= 0; --i) {
      let ent = entities.data[i];
      let widget = ent.getComp('Widget');
      widget.getWorldCorners(a, b, c, d);

      if (intersect.line_quad(p, q, a, b, c, d)) {
        // check if we have mask, and if mask contains the intersect entity
        let parent = ent.parent;
        let parentWidget = parent.getComp('Widget');
        let skip = false;

        // NOTE: we must test all masks
        while (parentWidget) {
          if (parent.getComp('Mask')) {
            parentWidget.getWorldCorners(a, b, c, d);
            if (intersect.line_quad(p, q, a, b, c, d) === false) {
              skip = true;
            }
          }

          parent = parent.parent;
          parentWidget = parent.getComp('Widget');
        }

        if (skip) {
          continue;
        }

        return ent;
      }
    }

    return null;
  };
})();

export default class WidgetSystem extends System {
  constructor() {
    super();

    this._screens = [];
    this._screenRenderHelper = null;

    this._hoveringEntity = null;
    this._focusedEntity = null;
    this._capturingEntities = [];
    this._mouseEventPool = new RecyclePool(() => {
      return new MouseEvent('unknown');
    }, 8);
    this._keyboardEventPool = new RecyclePool(() => {
      return new KeyboardEvent('unknown');
    }, 8);
    this._touchEventPool = new RecyclePool(() => {
      return new TouchEvent('unknown');
    }, 8);
    this._focusEventPool = new RecyclePool(() => {
      return new FocusEvent('unknown');
    }, 8);
  }

  get hoveringEntity() {
    return this._hoveringEntity;
  }

  get focusedEntity() {
    return this._focusedEntity;
  }

  init() {
    this._screenRenderHelper = new ScreenRenderHelper(this._app);
  }

  addScreen(comp) {
    this._screens.push(comp);
    this._app.scene.addView(comp._view);
  }

  removeScreen(comp) {
    let idx = this._screens.indexOf(comp);
    if (idx !== -1) {
      this._screens.splice(idx, 1);
      this._app.scene.removeView(comp._view);
    }
  }

  tick() {
    this._mouseEventPool.reset();
    this._keyboardEventPool.reset();
    this._touchEventPool.reset();
    this._focusEventPool.reset();
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

      _entities.push(screen._entity);
      utils.walkSibling(screen._entity, ent => {
        if (ent.enabled === false) {
          return false;
        }

        _entities.push(ent);
        return true;
      });
    }

    // // process inputs
    this._processInputs(_entities);

    // // process layout
    this._processLayout(_entities);

    // render screen elements (in the order of hierarchy)
    this._renderScreens();
  }

  _processInputs(entities) {
    const input = this._app.input;
    let targetEnt = null;

    // ==========================
    // handle touches
    // ==========================

    if (input.hasTouch) {
      for (let i = 0; i < input.touchCount; ++i) {
        let touchInfo = input.getTouchInfo(i);
        targetEnt = this._capturingEntities[i] ? this._capturingEntities[i] : targetEnt;
        if (targetEnt === null) {
          targetEnt = _getWidgetAt(screen, entities, touchInfo.x, touchInfo.y);
        }

        if (targetEnt === null) {
          continue;
        }

        let touchEvent = this._touchEventPool.add();
        touchEvent.reset();
        touchEvent.id = touchInfo.id;
        touchEvent.dx = touchInfo.dx;
        touchEvent.dy = touchInfo.dy;
        touchEvent.x = touchInfo.x;
        touchEvent.y = touchInfo.y;
        touchEvent.target = targetEnt;

        if (touchInfo.phase === 'start') {
          // NOTE: only first element can focus
          if (i === 0) {
            this._focus(targetEnt);
          }

          touchEvent.name = 'touchstart';
          touchEvent.bubbles = true;
          targetEnt.dispatch(touchEvent);
          this._capturingEntities[i] = targetEnt;
          // NOTE: only first element can hover
          if (i === 0) {
            this._hover(targetEnt, true);
          }
        } else if (touchInfo.phase === 'pressing') {
          if (touchInfo.dx !== 0 || touchInfo.dy !== 0) {
            if (i === 0) {
              this._hover(targetEnt, true);
            }

            touchEvent.name = 'touchmove';
            touchEvent.bubbles = true;
            targetEnt.dispatch(touchEvent);
          }
        } else if (touchInfo.phase === 'end') {
          if (i === 0) {
            this._hover(null, true);
          }

          touchEvent.name = 'touchend';
          touchEvent.bubbles = true;
          targetEnt.dispatch(touchEvent);
          this._capturingEntities[i] = null;
        } else if (touchInfo.phase === 'cancel') {
          if (i === 0) {
            this._hover(null, true);
          }

          touchEvent.name = 'touchcancel';
          touchEvent.bubbles = true;
          targetEnt.dispatch(touchEvent);
          this._capturingEntities[i] = null;
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
      targetEnt = this._capturingEntities[0] ? this._capturingEntities[0] : targetEnt;
      if (targetEnt === null) {
        targetEnt = _getWidgetAt(screen, entities, input.mouseX, input.mouseY);
      }
    }

    // ==========================
    // handle focus
    // ==========================

    if (mousedown) {
      this._focus(targetEnt);
      this._capturingEntities[0] = targetEnt;
    }

    if (targetEnt) {
      // emit mousedown
      if (mousedown) {
        for (let i = 0; i < _mouseBtns.length; ++i) {
          let btn = _mouseBtns[i];
          if (input.mousedown(btn)) {
            let mouseEvent = this._mouseEventPool.add();
            mouseEvent.reset();
            mouseEvent.name = 'mousedown';
            mouseEvent.bubbles = true;
            mouseEvent.dx = input.mouseDeltaX;
            mouseEvent.dy = input.mouseDeltaY;
            mouseEvent.mouseX = input.mouseX;
            mouseEvent.mouseY = input.mouseY;
            mouseEvent.target = targetEnt;
            mouseEvent.button = btn;
            mouseEvent.buttons = input.mouseButtons;

            targetEnt.dispatch(mouseEvent);
          }
        }
      }

      // emit mouseup
      if (mouseup) {
        for (let i = 0; i < _mouseBtns.length; ++i) {
          let btn = _mouseBtns[i];
          if (input.mouseup(btn)) {
            let mouseEvent = this._mouseEventPool.add();
            mouseEvent.reset();
            mouseEvent.name = 'mouseup';
            mouseEvent.bubbles = true;
            mouseEvent.dx = input.mouseDeltaX;
            mouseEvent.dy = input.mouseDeltaY;
            mouseEvent.mouseX = input.mouseX;
            mouseEvent.mouseY = input.mouseY;
            mouseEvent.target = targetEnt;
            mouseEvent.button = btn;
            mouseEvent.buttons = input.mouseButtons;

            targetEnt.dispatch(mouseEvent);
          }
        }
        this._capturingEntities[0] = null;
      }
    }

    if (mousemoved) {
      this._hover(targetEnt, false);

      // emit mousemove
      if (targetEnt) {
        let mouseEvent = this._mouseEventPool.add();
        mouseEvent.reset();
        mouseEvent.name = 'mousemove';
        mouseEvent.bubbles = true;
        mouseEvent.dx = input.mouseDeltaX;
        mouseEvent.dy = input.mouseDeltaY;
        mouseEvent.mouseX = input.mouseX;
        mouseEvent.mouseY = input.mouseY;
        mouseEvent.target = targetEnt;
        mouseEvent.button = 0;
        mouseEvent.buttons = input.mouseButtons;

        targetEnt.dispatch(mouseEvent);
      }
    }

    // ==========================
    // handle keyboard input
    // ==========================

    if (this._focusedEntity) {
      input._keys.forEach(keyInfo => {
        if (keyInfo.state === 'down') {
          let keyboardEvent = this._keyboardEventPool.add();
          keyboardEvent.reset();
          keyboardEvent.name = 'keydown';
          keyboardEvent.bubbles = true;
          keyboardEvent.key = keyInfo.key;
          keyboardEvent.target = this._focusedEntity;

          this._focusedEntity.dispatch(keyboardEvent);
        }

        if (keyInfo.state === 'up') {
          let keyboardEvent = this._keyboardEventPool.add();
          keyboardEvent.reset();
          keyboardEvent.name = 'keyup';
          keyboardEvent.bubbles = true;
          keyboardEvent.key = keyInfo.key;
          keyboardEvent.target = this._focusedEntity;

          this._focusedEntity.dispatch(keyboardEvent);
        }
      });
    }
  }

  _focus(ent) {
    // get focusable entity
    let focusableEnt = ent;
    if (focusableEnt && focusableEnt._destroyed) {
      focusableEnt = null;
    }
    let focusableWidget = focusableEnt ? focusableEnt.getComp('Widget') : null;
    while (focusableWidget) {
      if (focusableWidget.focusable) {
        break;
      }

      focusableEnt = focusableEnt.parent;
      focusableWidget = focusableEnt.getComp('Widget');
    }

    if (this._focusedEntity === focusableEnt) {
      return;
    }

    let lastFocused = this._focusedEntity;
    this._focusedEntity = focusableEnt;

    // blur
    if (lastFocused) {
      let focusEvent = this._focusEventPool.add();
      focusEvent.reset();
      focusEvent.name = 'blur';
      focusEvent.bubbles = false;
      focusEvent.target = lastFocused;
      focusEvent.relatedTarget = focusableEnt;

      lastFocused.dispatch(focusEvent);
    }

    // focus
    if (focusableEnt) {
      let focusEvent = this._focusEventPool.add();
      focusEvent.reset();
      focusEvent.name = 'focus';
      focusEvent.bubbles = false;
      focusEvent.target = focusableEnt;
      focusEvent.relatedTarget = lastFocused;

      focusableEnt.dispatch(focusEvent);
    }
  }

  _hover(targetEnt, isTouch) {
    if (this._hoveringEntity === targetEnt) {
      return;
    }

    const input = this._app.input;
    let lastHovering = this._hoveringEntity;
    this._hoveringEntity = targetEnt;

    let leaves = [];
    let enters = [];

    // get leaves
    let ent = lastHovering;
    if (ent && ent._destroyed) {
      ent = null;
    }
    let widget = ent ? ent.getComp('Widget') : null;
    while (widget) {
      leaves.push(ent);
      ent = ent.parent;
      widget = ent.getComp('Widget');
    }

    // get enters
    ent = targetEnt;
    widget = ent ? ent.getComp('Widget') : null;
    while (widget) {
      enters.push(ent);
      ent = ent.parent;
      widget = ent.getComp('Widget');
    }

    let lcnt = leaves.length;
    let ecnt = enters.length;
    let stop = false;

    for (let i = 0; i < leaves.length; ++i) {
      let leave = leaves[i];

      for (let j = 0; j < enters.length; ++j) {
        let enter = enters[i];
        if (enter === leave) {
          lcnt = i;
          ecnt = j;
          stop = true;
        }
      }

      if (stop) {
        break;
      }
    }

    if (!isTouch) {
      // emit mouseleave
      for (let i = 0; i < lcnt; ++i) {
        let ent = leaves[i];
        let mouseEvent = this._mouseEventPool.add();
        mouseEvent.reset();
        mouseEvent.name = 'mouseleave';
        mouseEvent.bubbles = false;
        mouseEvent.dx = input.mouseDeltaX;
        mouseEvent.dy = input.mouseDeltaY;
        mouseEvent.mouseX = input.mouseX;
        mouseEvent.mouseY = input.mouseY;
        mouseEvent.target = ent;
        mouseEvent.button = 0;
        mouseEvent.buttons = input.mouseButtons;

        ent.emit('mouseleave', mouseEvent);
      }

      // emit mouseenter
      for (let i = ecnt - 1; i >= 0; --i) {
        let ent = enters[i];
        let mouseEvent = this._mouseEventPool.add();
        mouseEvent.reset();
        mouseEvent.name = 'mouseenter';
        mouseEvent.bubbles = false;
        mouseEvent.dx = input.mouseDeltaX;
        mouseEvent.dy = input.mouseDeltaY;
        mouseEvent.mouseX = input.mouseX;
        mouseEvent.mouseY = input.mouseY;
        mouseEvent.target = ent;
        mouseEvent.button = 0;
        mouseEvent.buttons = input.mouseButtons;

        ent.emit('mouseenter', mouseEvent);
      }
    } else {
      let touchInfo = input.getTouchInfo(0);

      // emit touchleave
      for (let i = 0; i < lcnt; ++i) {
        let ent = leaves[i];
        let touchEvent = this._touchEventPool.add();
        touchEvent.reset();
        touchEvent.name = 'touchleave';
        touchEvent.bubbles = false;
        touchEvent.id = touchInfo.id;
        touchEvent.dx = touchInfo.dx;
        touchEvent.dy = touchInfo.dy;
        touchEvent.x = touchInfo.x;
        touchEvent.y = touchInfo.y;
        touchEvent.target = ent;

        ent.emit('touchleave', touchEvent);
      }

      // emit touchenter
      for (let i = ecnt - 1; i >= 0; --i) {
        let ent = enters[i];
        let touchEvent = this._touchEventPool.add();
        touchEvent.reset();
        touchEvent.name = 'touchenter';
        touchEvent.bubbles = false;
        touchEvent.id = touchInfo.id;
        touchEvent.dx = touchInfo.dx;
        touchEvent.dy = touchInfo.dy;
        touchEvent.x = touchInfo.x;
        touchEvent.y = touchInfo.y;
        touchEvent.target = ent;

        ent.emit('touchenter', touchEvent);
      }
    }
  }

  _processLayout(entities) {
    for (let i = 0; i < entities.length; ++i) {
      let entity = entities.data[i];
      let widget = entity.getComp('Widget');
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
        // the widget is the screen if parent widget is null
        parentWidth = this._app._canvas.width / widget.scaleFactor;
        parentHeight = this._app._canvas.height / widget.scaleFactor;
        widget.setOffset(0, 0);
        widget.setAnchors(0, 0, 0, 0);
        widget.setSize(parentWidth, parentHeight);
        widget.setPivot(0, 0);
      } else {
        parentX = parentWidget._rect.x;
        parentY = parentWidget._rect.y;
        parentWidth = parentWidget._rect.w;
        parentHeight = parentWidget._rect.h;
      }

      //
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
      let canvasWidth = this._app._canvas.width;
      let canvasHeight = this._app._canvas.height;
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
        let mask = entity.getComp('Mask');
        if (mask && mask.enabled) {
          this._screenRenderHelper.pushMask(mask);
        }

        let image = entity.getComp('Image');
        if (image && image.enabled) {
          this._screenRenderHelper.addImage(image);
        }

        let text = entity.getComp('Text');
        if (text && text.enabled) {
          this._screenRenderHelper.addText(text);
        }

      }, entity => {
        let mask = entity.getComp('Mask');
        if (mask && mask.enabled) {
          this._screenRenderHelper.popMask(mask);
        }
      });
    }
  }
}