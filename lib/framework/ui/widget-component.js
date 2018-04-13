import { vec3, mat4 } from 'vmath';
import { Component } from '../../ecs';

let _wmat = mat4.create();

export default class WidgetComponent extends Component {
  constructor() {
    super();

    // calculated rect
    this._rect = { x: 0, y: 0, w: 0, h: 0 };
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
   * @param {number} l
   * @param {number} b
   * @param {number} r
   * @param {number} t
   */
  setMargin(l, b, r, t) {
    this._marginLeft = l;
    this._marginRight = r;
    this._marginBottom = b;
    this._marginTop = t;
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
   * @param {number} w
   * @param {number} h
   */
  setSize(w, h) {
    this._width = w;
    this._height = h;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setPivot(x, y) {
    this._pivotX = x;
    this._pivotY = y;
  }

  /**
   * @param {number} val
   */
  alignLeft(val) {
    if (this._anchorLeft === this._anchorRight) {
      this._offsetX = val + this._width * this._pivotX;
    } else {
      this._marginLeft = val;
    }
  }

  /**
   * @param {number} val
   */
  alignRight(val) {
    if (this._anchorLeft === this._anchorRight) {
      this._offsetX = -(val + this._width * (1.0 - this._pivotX));
    } else {
      this._marginRight = val;
    }
  }

  /**
   * @param {number} val
   */
  alignBottom(val) {
    if (this._anchorBottom === this._anchorTop) {
      this._offsetY = val + this._height * this._pivotY;
    } else {
      this._marginBottom = val;
    }
  }

  /**
   * @param {number} val
   */
  alignTop(val) {
    if (this._anchorBottom === this._anchorTop) {
      this._offsetY = -(val + this._height * (1.0 - this._pivotY));
    } else {
      this._marginTop = val;
    }
  }

  // calculate
  calculate(parentX, parentY, parentWidth, parentHeight) {
    let refMinX = parentX + parentWidth * this._anchorLeft;
    let refMinY = parentY + parentHeight * this._anchorBottom;
    let refMaxX = parentX + parentWidth * this._anchorRight;
    let refMaxY = parentY + parentHeight * this._anchorTop;

    let dx = refMaxX - refMinX;
    let dy = refMaxY - refMinY;

    let rectX = 0.0;
    let rectY = 0.0;
    let rectWidth = 0.0;
    let rectHeight = 0.0;

    if (dx === 0.0) {
      rectX = refMinX - this._width * this._pivotX + this._offsetX;
      rectWidth = this._width;
    } else {
      rectX = refMinX + this._marginLeft;
      rectWidth = dx - (this._marginLeft + this._marginRight);
    }

    if (dy === 0.0) {
      rectY = refMinY - this._height * this._pivotY + this._offsetY;
      rectHeight = this._height;
    } else {
      rectY = refMinY + this._marginBottom;
      rectHeight = dy - (this._marginBottom + this._marginTop);
    }

    vec3.set(
      this._entity.lpos,
      rectX + rectWidth * this._pivotX,
      rectY + rectHeight * this._pivotY,
      this._entity.lpos.z
    );

    rectX = rectX - this._entity.lpos.x;
    rectY = rectY - this._entity.lpos.y;

    //
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

  width: {
    type: 'number',
    default: 100.0,
  },

  height: {
    type: 'number',
    default: 100.0,
  },

  marginLeft: {
    type: 'number',
    default: 0.0,
  },

  marginBottom: {
    type: 'number',
    default: 0.0,
  },

  marginRight: {
    type: 'number',
    default: 0.0,
  },

  marginTop: {
    type: 'number',
    default: 0.0,
  },
};