import { vec3 } from 'vmath';
import { Component } from 'ecs.js';
import enums from '../enums';

class _uvalue {
  constructor(val, unit) {
    this._value = val;
    this._unit = unit; // px, %
  }

  calcValue(refSize) {
    if (this._unit === 'px') {
      return this._value;
    }

    return (this._value / 100.0) * refSize;
  }
}

export default class WidgetComponent extends Component {
  constructor() {
    super();

    this._pivotX = 0.5;
    this._pivotY = 0.5;
    this._offsetX = 0.0;
    this._offsetY = 0.0;

    this._width = new _uvalue(100, 'px');
    this._height = new _uvalue(100, 'px');
    this._top = new _uvalue(0, 'px');
    this._bottom = new _uvalue(0, 'px');
    this._left = new _uvalue(0, 'px');
    this._right = new _uvalue(0, 'px');

    this._alignTop = false;
    this._alignBottom = false;
    this._alignLeft = false;
    this._alignRight = false;

    this._dirty = false;
    this._calcWidth = 100.0;
    this._calcHeight = 100.0;
  }

  setAnchors(anchors) {
    // TODO:
    // this._dirty = true;

    if (anchors === enums.ANCHOR_NONE) {
      this._alignTop = false;
      this._alignBottom = false;
      this._alignLeft = false;
      this._alignRight = false;

      return;
    }

    this._alignTop = anchors & enums.ANCHOR_TOP;
    this._alignBottom = anchors & enums.ANCHOR_BOTTOM;
    this._alignLeft = anchors & enums.ANCHOR_LEFT;
    this._alignRight = anchors & enums.ANCHOR_RIGHT;
  }

  // width
  set width(val) {
    this._width._value = val;
  }
  get width() {
    return this._width._value;
  }

  // height
  set height(val) {
    this._height._value = val;
  }
  get height() {
    return this._height._value;
  }

  // widthUnit
  set widthUnit(val) {
    this._width._unit = val;
  }
  get widthUnit() {
    return this._width._unit;
  }

  // heightUnit
  set heightUnit(val) {
    this._height._unit = val;
  }
  get heightUnit() {
    return this._height._unit;
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

  // alignTop
  set alignTop(val) {
    this._alignTop = val;
  }
  get alignTop() {
    return this._alignTop;
  }

  // alignBottom
  set alignBottom(val) {
    this._alignBottom = val;
  }
  get alignBottom() {
    return this._alignBottom;
  }

  // alignLeft
  set alignLeft(val) {
    this._alignLeft = val;
  }
  get alignLeft() {
    return this._alignLeft;
  }

  // alignRight
  set alignRight(val) {
    this._alignRight = val;
  }
  get alignRight() {
    return this._alignRight;
  }

  // calculate
  calculate(parentPivotX, parentPivotY, parentWidth, parentHeight) {
    let parentLeft = -parentPivotX * parentWidth;
    let parentRight = (1.0 - parentPivotX) * parentWidth;
    let parentBottom = -parentPivotY * parentHeight;
    let parentTop = (1.0 - parentPivotY) * parentHeight;

    let expectWidth = this._width.calcValue(parentWidth);
    let expectHeight = this._height.calcValue(parentHeight);

    let left = -this._pivotX * expectWidth;
    let right = (1.0 - this._pivotX) * expectWidth;
    let bottom = -this._pivotY * expectHeight;
    let top = (1.0 - this._pivotY) * expectHeight;

    if (this._alignLeft && this._alignRight) {
      left = parentLeft + this._left.calcValue(parentWidth);
      right = parentRight - this._right.calcValue(parentWidth);
    } else if (this._alignLeft) {
      left = parentLeft + this._left.calcValue(parentWidth);
      right = left + expectWidth;
    } else if (this._alignRight) {
      right = parentRight - this._right.calcValue(parentWidth);
      left = right - expectWidth;
    }

    if (this._alignBottom && this._alignTop) {
      bottom = parentBottom + this._bottom.calcValue(parentHeight);
      top = parentTop - this._top.calcValue(parentHeight);
    } else if (this._alignBottom) {
      bottom = parentBottom + this._bottom.calcValue(parentHeight);
      top = bottom + expectHeight;
    } else if (this._alignTop) {
      top = parentTop - this._top.calcValue(parentHeight);
      bottom = top - expectHeight;
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