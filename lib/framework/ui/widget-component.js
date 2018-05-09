import { vec3, mat4 } from '../../vmath';
import { Component } from '../../ecs';

let _wmat = mat4.create();

export default class WidgetComponent extends Component {
  constructor() {
    super();

    // calculated rect
    this._rect = { x: 0, y: 0, w: 0, h: 0 };
    // anchored position
    this._anchorLeft = this._anchorRight = this._anchorBottom = this._anchorTop = 0.5;
    // the offset of pivot of rect to the pivot of ref rect
    this._offsetX = this._offsetY = 0;
    // the size decrease of rect to the ref rect
    this._sizeX = this._sizeY = 100;
    // the pivot
    this._pivotX = this._pivotY = 0.5;
  }

  // override functions
  _onRectChanged() {
  }

  /**
   * @param {number} l
   * @param {number} b
   * @param {number} r
   * @param {number} t
   */
  setAnchors(l, b, r, t) {
    this._anchorLeft = l;
    this._anchorRight = r;
    this._anchorBottom = b;
    this._anchorTop = t;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setOffset(x, y) {
    this._offsetX = x;
    this._offsetY = y;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setSize(x, y) {
    this._sizeX = x;
    this._sizeY = y;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setPivot(x, y) {
    this._pivotX = x;
    this._pivotY = y;
  }

  getLeft() {
    return this._offsetX - (this._sizeX * this._pivotX);
  }

  getRight() {
    return -(this._offsetX + (this._sizeX * (1 - this._pivotX)));
  }

  getBottom() {
    return this._offsetY - (this._sizeY * this._pivotY);
  }

  getTop() {
    return -(this._offsetY + (this._sizeY * (1 - this._pivotY)));
  }

  setLeft(val) {
    let offset = val - (this._offsetX - (this._sizeX * this._pivotX));
    this._sizeX -= offset;
    this._offsetX += offset * (1 - this._pivotX);
  }

  setRight(val) {
    let offset = -val - (this._offsetX + (this._sizeX * (1 - this._pivotX)));
    this._sizeX += offset;
    this._offsetX += offset * this._pivotX;
  }

  setBottom(val) {
    let offset = val - (this._offsetY - (this._sizeY * this._pivotY));
    this._sizeY -= offset;
    this._offsetY += offset * (1 - this._pivotY);
  }

  setTop(val) {
    let offset = -val - (this._offsetY + (this._sizeY * (1 - this._pivotY)));
    this._sizeY += offset;
    this._offsetY += offset * this._pivotY;
  }

  // calculate
  calculate(parentX, parentY, parentWidth, parentHeight) {
    let refMinX = parentX + parentWidth * this._anchorLeft;
    let refMinY = parentY + parentHeight * this._anchorBottom;
    let refMaxX = parentX + parentWidth * this._anchorRight;
    let refMaxY = parentY + parentHeight * this._anchorTop;

    // let dx = refMaxX - refMinX;
    // let dy = refMaxY - refMinY;

    let rectX = 0.0;
    let rectY = 0.0;
    let rectWidth = 0.0;
    let rectHeight = 0.0;

    // refWidth = refMax - refMin
    // rectWith = refWidth + sizeX
    rectWidth = refMaxX - refMinX + this._sizeX;
    rectHeight = refMaxY - refMinY + this._sizeY;

    rectX = refMinX + this._offsetX - (this._sizeX * this._pivotX);
    rectY = refMinY + this._offsetY - (this._sizeY * this._pivotY);

    let newPosX = rectX + rectWidth * this._pivotX;
    let newPosY = rectY + rectHeight * this._pivotY;

    vec3.set(
      this._entity.lpos,
      newPosX,
      newPosY,
      this._entity.lpos.z
    );

    rectX = rectX - newPosX;
    rectY = rectY - newPosY;

    // update callbacks
    if (
      rectX !== this._rect.x ||
      rectY !== this._rect.y ||
      rectWidth !== this._rect.w ||
      rectHeight !== this._rect.h
    ) {
      this._onRectChanged();
    }

    this._rect.x = rectX;
    this._rect.y = rectY;
    this._rect.w = rectWidth;
    this._rect.h = rectHeight;

  }

  getWorldCorners(outA, outB, outC, outD) {
    this._entity.getWorldMatrix(_wmat);

    let x = this._rect.x;
    let y = this._rect.y;
    let w = this._rect.w;
    let h = this._rect.h;

    // a
    vec3.set(outA, x, y + h, 0.0);
    vec3.transformMat4(outA, outA, _wmat);

    // b
    vec3.set(outB, x, y, 0.0);
    vec3.transformMat4(outB, outB, _wmat);

    // c
    vec3.set(outC, x + w, y, 0.0);
    vec3.transformMat4(outC, outC, _wmat);

    // d
    vec3.set(outD, x + w, y + h, 0.0);
    vec3.transformMat4(outD, outD, _wmat);
  }
}

WidgetComponent.schema = {
  focusable: {
    type: 'boolean',
    default: false,
  },

  pivotX: {
    type: 'number',
    default: 0.5,
  },

  pivotY: {
    type: 'number',
    default: 0.5,
  },

  anchorLeft: {
    type: 'number',
    default: 0.5,
  },

  anchorBottom: {
    type: 'number',
    default: 0.5,
  },

  anchorRight: {
    type: 'number',
    default: 0.5,
  },

  anchorTop: {
    type: 'number',
    default: 0.5,
  },

  offsetX: {
    type: 'number',
    default: 0.0,
  },

  offsetY: {
    type: 'number',
    default: 0.0,
  },

  sizeX: {
    type: 'number',
    default: 100.0,
  },

  sizeY: {
    type: 'number',
    default: 100.0,
  },
};