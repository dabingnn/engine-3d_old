import UIElementComponent from './ui-element-component';
import * as mathUtils from '../../vmath';
import { vec2 } from '../../vmath';

export default class GridLayoutComponent extends UIElementComponent {
  constructor() {
    super();

    this._childManager = [];
    this._childAlignEnum = 0;
    this._cornerEnum = 0;
    this._lastSize = vec2.zero();

    this._dirty = false;
  }

  onInit() {
    super.onInit();
    this._widget = this._entity.getComp('Widget');
    let options = ['upper-left', 'upper-center', 'upper-right', 'middle-left', 'middle-center', 'middle-right', 'lower-left', 'lower-center', 'lower-right'];
    this._childAlignEnum = options.indexOf(this._childAlign);
    if (this._childAlignEnum === -1) {
      this._childAlignEnum = 0;
    }

    options = ['upper-left', 'upper-right', 'lower-left', 'lower-right'];
    this._cornerEnum = options.indexOf(this._corner);
    if (this._cornerEnum === -1) {
      this._cornerEnum = 0;
    }

    this._lastSize = vec2.new(this._widget._rect.w, this._widget._rect.h);
  }

  tick() {
    if (!vec2.equals(this._lastSize, vec2.new(this._widget._rect.w, this._widget._rect.h))) {
      this._lastSize = vec2.new(this._widget._rect.w, this._widget._rect.h);
      this._dirty = true;
    }

    if (!this._dirty) {
      if (this._childManager.length !== this._entity.children.length) {
        this._dirty = true;
      } else {
        for (let i = 0; i < this._entity.children.length; ++i) {
          let child = this._entity.children[i];
          if (child.enabled !== this._childManager[i].enabled) {
            this._dirty = true;
            break;
          }
        }
      }
    }

    if (this._dirty) {
      this._calculate();
      this._dirty = false;
    }
  }

  reset() {
    this._setSpacing(0, 0);
    this._setPadding(0, 0, 0, 0);
    this._setCellSize(100, 100);
    this._axisDirection = 'horizontal';
    let options = ['upper-left', 'upper-right', 'lower-left', 'lower-right'];
    this._corner = 'upper-left';
    this._cornerEnum = options.indexOf(this._corner);
    options = ['upper-left', 'upper-center', 'upper-right', 'middle-left', 'middle-center', 'middle-right', 'lower-left', 'lower-center', 'lower-right'];
    this._childAlign = 'upper-left';
    this._childAlignEnum = options.indexOf(this._childAlign);
    this._constraint = 'flexible';
    this._constraintCount = 2;
    this._dirty = true;
  }

  _calculate() {
    if (!this._widget) {
      return;
    }

    this._childManager = [];
    let width = this._widget._rect.w, height = this._widget._rect.h;
    let childCount = this._entity.children.length;

    let row, col;
    if (this._constraint === 'fixed-row') {
      row = mathUtils.clamp(this._constraintCount, 1, childCount);
      col = Math.max(1, Math.ceil(childCount / (1.0 * row)));
    } else if (this._constraint === 'fixed-col') {
      col = mathUtils.clamp(this._constraintCount, 1, childCount);
      row = Math.max(1, Math.ceil(childCount / (1.0 * col)));
    } else {
      if (this._cellWidth + this._spacingX <= 0) {
        col = 65535;
      } else {
        col = Math.floor((width - this._getPaddingHorizontal() + this._spacingX) / (this._cellWidth + this._spacingX));
        col = Math.max(1, col);
      }

      if (this._cellHeight + this._spacingY <= 0) {
        row = 65535;
      } else {
        row = Math.floor((height - this._getPaddingVertical() + this._spacingY) / (this._cellHeight + this._spacingY));
        row = Math.max(1, row);
      }
    }

    let actualX, actualY, contentCount;
    if (this._axisDirection === 'horizontal') {
      contentCount = col;
      actualX = mathUtils.clamp(col, 1, childCount);
      actualY = mathUtils.clamp(row, 1, Math.ceil(childCount / (1.0 * contentCount)));
    } else {
      contentCount = row;
      actualY = mathUtils.clamp(row, 1, childCount);
      actualX = mathUtils.clamp(col, 1, Math.ceil(childCount / (1.0 * contentCount)));
    }

    let contentSize = vec2.new(
      this._cellWidth * actualX + this._spacingX * (actualX - 1),
      this._cellHeight * actualY + this._spacingY * (actualY - 1)
    );
    let starOffset = vec2.new(this._getStartOffset('horizontal', contentSize.x), this._getStartOffset('vertical', contentSize.y));
    let cornerX = this._cornerEnum % 2, cornerY = parseInt(this._cornerEnum / 2);

    let index = 0;
    for (let i = 0; i < childCount; ++i) {
      let child = this._entity.children[i];
      if (child.enabled === false) {
        continue;
      }

      let widget = child.getComp('Widget');
      widget.setSize(this._cellWidth, this._cellHeight);
      widget.setAnchors(0, 1, 0, 1);

      let x, y;
      if (this._axisDirection === 'horizontal') {
        x = index % contentCount;
        y = parseInt(index / contentCount);
      } else {
        x = parseInt(index / contentCount);
        y = index % contentCount;
      }

      let xpos, ypos;
      if (cornerX === 1) {
        x = actualX - x - 1;
      }

      if (cornerY === 1) {
        y = actualY - y - 1;
      }

      xpos = starOffset.x + (this._cellWidth + this._spacingX) * x + widget.pivotX * this._cellWidth;
      ypos = starOffset.y + (this._cellHeight + this._spacingY) * y + (1 - widget.pivotY) * this._cellHeight;
      widget.setOffset(xpos, -ypos);
      this._childManager.push(child);
      index++;
    }
  }

  _getStartOffset(axis, contentSpace) {
    let addPaddingContentSpace = contentSpace + (axis === 'horizontal' ? this._getPaddingHorizontal() : this._getPaddingVertical());
    let offset = (axis === 'horizontal' ? this._widget._rect.w : this._widget._rect.h) - addPaddingContentSpace;
    let align = axis === 'horizontal' ? (this._childAlignEnum % 3) * 0.5 : parseInt(this._childAlignEnum / 3) * 0.5;
    return (axis === 'horizontal' ? this._paddingLeft : this._paddingTop) + offset * align;
  }

  _getPaddingHorizontal() {
    return this._paddingLeft + this._paddingRight;
  }

  _getPaddingVertical() {
    return this._paddingTop + this._paddingBottom;
  }

  _setPadding(l, b, r, t) {
    this._paddingLeft = l;
    this._paddingRight = r;
    this._paddingBottom = b;
    this._paddingTop = t;
  }

  _setSpacing(x, y) {
    this._spacingX = x;
    this._spacingY = y;
  }

  _setCellSize(w, h) {
    this._cellWidth = w;
    this._cellHeight = h;
  }

  getItems() {
    return this._childManager;
  }
}

GridLayoutComponent.schema = {
  axisDirection: {
    type: 'enums',
    default: 'horizontal',
    options: ['horizontal', 'vertical'],
    set(val) {
      if (this._axisDirection === val) {
        return;
      }

      this._axisDirection = val;
      this._dirty = true;
    },
  },

  paddingLeft: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._paddingLeft === val) {
        return;
      }

      this._paddingLeft = val;
      this._dirty = true;
    },
  },

  paddingRight: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._paddingRight === val) {
        return;
      }

      this._paddingRight = val;
      this._dirty = true;
    },
  },

  paddingBottom: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._paddingBottom === val) {
        return;
      }

      this._paddingBottom = val;
      this._dirty = true;
    },
  },

  paddingTop: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._paddingTop === val) {
        return;
      }

      this._paddingTop = val;
      this._dirty = true;
    },
  },

  cellWidth: {
    type: 'number',
    default: 100.0,
    set(val) {
      if (this._cellWidth === val) {
        return;
      }

      this._cellWidth = val;
      this._dirty = true;
    },
  },

  cellHeight: {
    type: 'number',
    default: 100.0,
    set(val) {
      if (this._cellHeight === val) {
        return;
      }

      this._cellHeight = val;
      this._dirty = true;
    },
  },

  spacingX: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._spacingX === val) {
        return;
      }

      this._spacingX = val;
      this._dirty = true;
    },
  },

  spacingY: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (this._spacingY === val) {
        return;
      }

      this._spacingY = val;
      this._dirty = true;
    },
  },

  corner: {
    // arrange towards
    type: 'enums',
    default: 'upper-left',
    options: ['upper-left', 'upper-right', 'lower-left', 'lower-right'],
    set(val) {
      if (this._corner === val) {
        return;
      }

      let options = ['upper-left', 'upper-right', 'lower-left', 'lower-right'];
      this._cornerEnum = options.indexOf(val);
      if (this._cornerEnum !== -1) {
        this._corner = val;
        this._dirty = true;
      } else {
        this._cornerEnum = 0;
      }
    },
  },

  childAlign: {
    // distribution of the rest of the content
    type: 'enums',
    default: 'upper-left',
    options: ['upper-left', 'upper-center', 'upper-right', 'middle-left', 'middle-center', 'middle-right', 'lower-left', 'lower-center', 'lower-right'],
    set(val) {
      if (this._childAlign === val) {
        return;
      }

      let options = ['upper-left', 'upper-center', 'upper-right', 'middle-left', 'middle-center', 'middle-right', 'lower-left', 'lower-center', 'lower-right'];
      this._childAlignEnum = options.indexOf(val);
      if (this._childAlignEnum !== -1) {
        this._childAlign = val;
        this._dirty = true;
      } else {
        this._childAlignEnum = 0;
      }
    },
  },

  constraint: {
    type: 'enums',
    default: 'flexible',
    options: ['flexible', 'fixed-row', 'fixed-col'],
    set(val) {
      if (this._constraint === val) {
        return;
      }

      this._constraint = val;
      this._dirty = true;
    },
  },

  constraintCount: {
    type: 'int',
    default: 2,
    set(val) {
      if (this._constraintCount === val) {
        return;
      }

      this._constraintCount = val;
      this._dirty = true;
    },
  },
}