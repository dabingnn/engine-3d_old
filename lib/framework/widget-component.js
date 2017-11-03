import { vec3 } from 'vmath';
import { Component } from 'ecs.js';
import enums from '../enums';

class _uvalue {
  constructor(val, unit, enabled) {
    this._value = val;
    this._unit = unit; // px, %
    this._enabled = enabled;
  }
}

export default class WidgetComponent extends Component {
  constructor() {
    super();

    this._width = 100.0;
    this._height = 100.0;
    this._pivotX = 0.5;
    this._pivotY = 0.5;
    this._offsetX = 0.0;
    this._offsetY = 0.0;

    this._top = new _uvalue(0, 'px', false);
    this._bottom = new _uvalue(0, 'px', false);
    this._left = new _uvalue(0, 'px', false);
    this._right = new _uvalue(0, 'px', false);

    this._dirty = false;
    this._calcWidth = 100.0;
    this._calcHeight = 100.0;
  }

  setAnchors(anchors) {
    // TODO:
    // this._dirty = true;

    if (anchors === enums.ANCHOR_NONE) {
      this._top._enabled = false;
      this._bottom._enabled = false;
      this._left._enabled = false;
      this._right._enabled = false;

      return;
    }

    this._top._enabled = anchors & enums.ANCHOR_TOP;
    this._bottom._enabled = anchors & enums.ANCHOR_BOTTOM;
    this._left._enabled = anchors & enums.ANCHOR_LEFT;
    this._right._enabled = anchors & enums.ANCHOR_RIGHT;
  }

  // width
  set width(val) {
    this._width = val;
  }
  get width() {
    return this._width;
  }

  // height
  set height(val) {
    this._height = val;
  }
  get height() {
    return this._height;
  }

  // pivotX
  set pivotX(val) {
    this._pivotX = val;
  }
  get pivotX() {
    return this._pivotX;
  }

  // pivotY
  set pivotY(val) {
    this._pivotY = val;
  }
  get pivotY() {
    return this._pivotY;
  }

  // offsetX
  set offsetX(val) {
    this._offsetX = val;
  }
  get offsetY() {
    return this._offsetX;
  }

  // offsetY
  set offsetY(val) {
    this._offsetY = val;
  }
  get posY() {
    return this._offsetY;
  }

  // top
  set top(val) {
    this._top._value = val;
  }
  get top() {
    return this._top._value;
  }

  // bottom
  set bottom(val) {
    this._bottom._value = val;
  }
  get bottom() {
    return this._bottom._value;
  }

  // left
  set left(val) {
    this._left._value = val;
  }
  get left() {
    return this._left._value;
  }

  // right
  set right(val) {
    this._right._value = val;
  }
  get right() {
    return this._right._value;
  }

  // alignTop
  set alignTop(val) {
    this._top._enabled = val;
  }
  get alignTop() {
    return this._top._enabled;
  }

  // alignBottom
  set alignBottom(val) {
    this._bottom._enabled = val;
  }
  get alignBottom() {
    return this._bottom._enabled;
  }

  // alignLeft
  set alignLeft(val) {
    this._left._enabled = val;
  }
  get alignLeft() {
    return this._left._enabled;
  }

  // alignRight
  set alignRight(val) {
    this._right._enabled = val;
  }
  get alignRight() {
    return this._right._enabled;
  }

  // topUnit
  set topUnit(unit) {
    this._top._unit = unit;
  }
  get topUnit() {
    return this._top._unit;
  }

  // bottomUnit
  set bottomUnit(unit) {
    this._bottom._unit = unit;
  }
  get bottomUnit() {
    return this._bottom._unit;
  }

  // leftUnit
  set leftUnit(unit) {
    this._left._unit = unit;
  }
  get leftUnit() {
    return this._left._unit;
  }

  // rightUnit
  set rightUnit(unit) {
    this._right._unit = unit;
  }
  get rightUnit() {
    return this._right._unit;
  }

  // calculate
  calculate(parentPivotX, parentPivotY, parentWidth, parentHeight) {
    let parentLeft = -parentPivotX * parentWidth;
    let parentRight = (1.0 - parentPivotX) * parentWidth;
    let parentBottom = -parentPivotY * parentHeight;
    let parentTop = (1.0 - parentPivotY) * parentHeight;

    let left = 0;
    let right = this._width;
    let bottom = 0;
    let top = this._height;

    if (this._left._enabled && this._right._enabled) {
      left = parentLeft + this._left._value;
      right = parentRight - this._right._value;
    } else if (this._left._enabled) {
      left = parentLeft + this._left._value;
      right = left + this._width;
    } else if (this._right._enabled) {
      right = parentRight - this._right._value;
      left = right - this._width;
    }

    if (this._bottom._enabled && this._top._enabled) {
      bottom = parentBottom + this._bottom._value;
      top = parentTop - this._top._value;
    } else if (this._bottom._enabled) {
      bottom = parentBottom + this._bottom._value;
      top = bottom + this._height;
    } else if (this._top._enabled) {
      top = parentTop - this._top._value;
      bottom = top - this._height;
    }

    let width = right - left;
    let height = top - bottom;

    this._calcWidth = width;
    this._calcHeight = height;

    vec3.set(
      this._entity.lpos,
      left + this._offsetX + width * this._pivotX,
      bottom + this._offsetY + height * this._pivotY,
      0.0
    );
  }
}