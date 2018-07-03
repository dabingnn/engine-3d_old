import UIElementComponent from './ui-element-component';
import { vec3, color4, vec2 } from '../../vmath';
import { Entity } from '../../ecs';
import * as mathUtils from '../../vmath';

export default class ScrollBarComponent extends  UIElementComponent{
  constructor() {
    super();
    this._state = 'none';
    this._highlighting = false;
    this._pressing = false;
    this._widget = null;

    this._dragging = false;
    this._handleWidget = null;
    this._startDistance = 0.0;
    this._fingerId = -1;

    this._onMouseEnter = (e) => {
      if (this.enabled === false) {
        return;
      }

      let widgetSys = this._widget.system;
      this._highlighting = true;

      if (
        widgetSys.focusedEntity === this._entity &&
        e.buttons & 1 !== 0
      ) {
        this._pressing = true;
      }

      this._updateState();
    };

    this._onMouseLeave = () => {
      if (this.enabled === false) {
        return;
      }

      let widgetSys = this._widget.system;

      this._pressing = false;
      if (
        widgetSys.focusedEntity &&
        widgetSys.focusedEntity === this._entity
      ) {
        this._highlighting = true;
      } else {
        this._highlighting = false;
      }

      this._updateState();
    };

    this._onMouseDown = (e) => {
      if (this.enabled === false) {
        return;
      }

      let widgetSys = this._widget.system;
      if (e.button === 'left') {
        e.stop();

        if (widgetSys.focusedEntity !== this._entity) {
          return;
        }

        this._pressing = true;
        this._updateState();
        if (e.target !== this._handle) {
          if (!this._dragging) {
            this._dragging = true;
            this._updateValue(vec2.new(e.mouseX, e.mouseY), true);
          }
        } else {
          this._dragging = true;
          this._startOffset(vec2.new(e.mouseX, e.mouseY));
        }
      }
    }

    this._onMouseMove = (e) => {
      if (this.enabled === false) {
        return;
      }

      if (e.button === 0) {
        e.stop();

        if (this._dragging) {
          this._updateValue(vec3.new(e.mouseX, e.mouseY, 0));
        }
      }
    };

    this._onMouseUp = (e) => {
      if (this.enabled === false) {
        return;
      }

      if (e.button === 'left') {
        e.stop();

        this._dragging = false;
        this._pressing = false;
        this._updateState();
      }
    };

    // touch events
    this._onTouchStart = (e) => {
      if (this.enabled === false) {
        return;
      }

      e.stop();
      if (this._fingerId !== -1) {
        return;
      }

      this._fingerId = e.id;
      this._pressing = true;
      this._updateState();
      this._startPos = vec3.new(e.x, e.y, 0);
      this._offsetValue = 0.0;
      if (e.target !== this._handle) {
        if (!this._dragging) {
          this._dragging = true;
          this._clkBar(vec3.new(e.x, e.y, 0), true);
        }
      } else {
        this._dragging = true;
        this._startOffset(vec2.new(e.x, e.y));
      }
    }

    this._onTouchMove = (e) => {
      if (this.enabled === false) {
        return;
      }

      e.stop();
      if (e.id === this._fingerId) {
        if (this._dragging) {
          this._updateValue(vec3.new(e.x, e.y, 0));
        }
      }
    };

    this._onTouchEnd = (e) => {
      if (this.enabled === false) {
        return;
      }

      e.stop();
      if (e.id !== this._fingerId) {
        return;
      }

      this._dragging = false;
      this._fingerId = -1;
      this._pressing = false;
      this._updateState();
    };
  }

  onInit() {
    this._widget = this._entity.getComp('Widget');
    this._widget.focusable = true;

    this._bgImage = this._background && this._background.getComp('Image');
    if (!this._bgImage) {
      this._bgImage = this._entity.getComp('Image');
    }

    this._handleWidget = this._handle && this._handle.getComp('Widget');

    super.onInit();
  }

  onEnable() {
    this._updateHandle();
  }

  onDestroy() {
    this._widget.focusable = false;
    super.onDestroy();
  }

  _updateState() {
    let state = 'normal';

    if (this._pressing) {
      state = 'pressed';
    } else if (this._highlighting) {
      state = 'highlight';
    }

    if (this._state === state) {
      return;
    }

    let oldState = this._state;
    this._state = state;

    this.dispatch('transition', {
      detail: {
        oldState,
        newState: this._state
      }
    });

    if (this._background === null) {
      return;
    }

    if (this._transition === 'none') {
      return;
    }

    if (this._transition === 'color') {
      this._background.color = this._transitionColors[state];
    } else if (this._transition === 'sprite') {
      this._background.sprite = this._transitionSprites[state];
    } else {
      // todo: not implemented
      console.warn('Button transition animation is not implemented');
    }
  }

  _set(val) {
    let value = this._value;
    if (val === value) {
      return;
    }

    this._value = mathUtils.clamp01(val);
    this._emitValueChangedEvents();
  }

  _updateValue(mouse, isClk = false) {
    if (!this._handle || !this._handle) {
      return;
    }

    let calWidget = this._getCalculateWidget();
    let corners = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
    calWidget.getWorldCorners(corners[0], corners[1], corners[2], corners[3]);
    let position = vec2.new(corners[1].x, corners[1].y);
    let calVec = vec2.create(), mouseVec = vec2.create();
    let calPos = this._direction === 'horizontal' ? vec2.new(corners[2].x, corners[2].y) : vec2.new(corners[0].x, corners[0].y);
    vec2.subtract(calVec, calPos, position);
    vec2.subtract(mouseVec, mouse, position);
    // ditance current center to origin center
    let offset = [calWidget._rect.w * this._size / 2, calWidget._rect.h * this._size / 2];
    let value = vec2.dot(calVec, mouseVec) / (this._direction === 'horizontal' ? calWidget._rect.w : calWidget._rect.h);
    if (this._direction === 'horizontal') {
      value -= (offset[0] + (isClk ? 0 : this._startDistance));
      value = mathUtils.clamp01(value / (calWidget._rect.w * (1 - this._size)));
    } else {
      value -= (offset[1] + (isClk ? 0 : this._startDistance));
      value = mathUtils.clamp01(value / (calWidget._rect.h * (1 - this._size)));
    }

    this.value = this._reverse ? 1 - value : value;
  }

  _startOffset(mouse) {
    let parentCorners = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
    let calWidget = this._getCalculateWidget();
    calWidget.getWorldCorners(parentCorners[0], parentCorners[1], parentCorners[2], parentCorners[3]);
    let calVec = vec3.create();
    if (this._direction === 'horizontal') {
      vec3.subtract(calVec, parentCorners[2], parentCorners[1]);
    } else {
      vec3.subtract(calVec, parentCorners[3], parentCorners[2]);
    }

    let corners = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
    this._handleWidget.getWorldCorners(corners[0], corners[1], corners[2], corners[3]);
    // get handle center
    let center = vec3.create(), delta = vec2.create();
    vec3.add(center, corners[3], corners[1]);
    vec3.divide(center, center, vec3.new(2, 2, 2));
    // get distance from mouse to center
    vec2.subtract(delta, mouse, vec2.new(center.x, center.y));
    let distance = vec2.dot(delta, vec2.new(calVec.x, calVec.y)) / (this._direction === 'horizontal' ? calWidget._rect.w : calWidget._rect.h);
    return distance;
  }

  _updateHandle() {
    if (!this._handle || !this._handle) {
      return;
    }

    let min = { 0: 0, 1: 0 };
    let max = { 0: 1, 1: 1 };
    let num = this._value * (1 - this._size);
    num = Math.round(parseFloat(num) * 100) / 100;
    let dirValue = this._direction === 'horizontal' ? 0 : 1;
    if (this._reverse) {
      min[dirValue] = 1.0 - num - this._size;
      max[dirValue] = 1.0 - num;
    } else {
      min[dirValue] = num;
      max[dirValue] = num + this._size;
    }

    this._handleWidget.setAnchors(min[0], min[1], max[0], max[1]);
  }

  _getCalculateWidget() {
    if (!this._handle || !this._handle) {
      return null;
    }

    let container = this._handle.parent.getComp('Widget');
    return container;
  }

  _onFocus() {
    if (this.enabled === false) {
      return;
    }

    this._highlighting = true;
    this._updateState();
  }

  _onBlur() {
    if (this.enabled === false) {
      return;
    }

    this._fingerId = -1;
    this._highlighting = false;
    this._updateState();
  }

  _onTouchEnter(e) {
    if (this.enabled === false) {
      return;
    }

    if (this._fingerId !== -1 && this._fingerId === e.id) {
      e.stop();
      this._pressing = true;
      this._updateState();
    }
  }

  _onTouchLeave(e) {
    if (this.enabled === false) {
      return;
    }

    if (this._fingerId !== -1 && this._fingerId === e.id) {
      e.stop();
      this._pressing = false;
      this._updateState();
    }
  }

  _emitValueChangedEvents() {
    this.dispatch('ScrollBar.onValueChanged');
  }
}

ScrollBarComponent.events = {
  'mouseenter': '_onMouseEnter',
  'mouseleave': '_onMouseLeave',
  'mousedown': '_onMouseDown',
  'mousemove': '_onMouseMove',
  'mouseup': '_onMouseUp',
  'focus': '_onFocus',
  'blur': '_onBlur',
  'touchenter': '_onTouchEnter',
  'touchleave': '_onTouchLeave',
  'touchstart': '_onTouchStart',
  'touchmove': '_onTouchMove',
  'touchend': '_onTouchEnd'
};

ScrollBarComponent.schema = {
  direction: {
    type: 'enums',
    default: 'horizontal',
    options: ['horizontal', 'vertical'],
    set(val) {
      if (val === this._direction) {
        return;
      }

      this._direction = val;
    }
  },

  size: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._size === val) {
        return;
      }

      this._size = mathUtils.clamp01(val);
      this._updateHandle();
    },
    get() {
      this._size = Math.round(parseFloat(this._size) * 100) / 100;
      return this._size;
    }
  },

  value: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._value === val) {
        return;
      }

      this._set(val);
      this._updateHandle();
    },
    get() {
      this._value = Math.round(parseFloat(this._value) * 100) / 100;
      return this._value;
    }
  },

  reverse: {
    type: 'boolean',
    default: false,
  },

  handle: {
    type: 'entity',
    default: null,
    set(val) {
      if (!(val instanceof Entity)) {
        return;
      }

      if (this._handle === val) {
        return;
      }

      this._handle = val;
      if (this._handle) {
        this._handleWidget = this._handle.getComp('Widget');
      }
    }
  },

  transitionColors: {
    type: 'object',
    default: {
      normal: color4.create(),
      highlight: color4.create(),
      pressed: color4.create(),
      disabled: color4.create(),
    }
  },

  transitionSprites: {
    type: 'object',
    default: {
      normal: null,
      highlight: null,
      pressed: null,
      disabled: null
    }
  },

  background: {
    type: 'entity',
    default: null,
    set(val) {
      if (!(val instanceof Entity)) {
        return;
      }

      if (this._background === val) {
        return;
      }

      this._background = val;
      if (this._background) {
        this._bgImage = this._background.getComp('Image');
      }
    }
  },

  transition: {
    type: 'enums',
    default: 'none',
    options: ['none', 'color', 'sprite']
  },
};
