import WidgetComponent from './widget-component';
import { vec2, vec3, mat4, color4 } from 'vmath';

let _x_tmp = [0.0, 0.0, 0.0, 0.0];
let _y_tmp = [0.0, 0.0, 0.0, 0.0];
let _m4_tmp = mat4.create();

/**
 * v2------v3
 * |       |
 * |       |
 * |       |
 * v0------v1
 */
const _simpleIndices = [
  0, 1, 2, 3, 2, 1
];

/**
 * v12---v13---v14---v15
 * |      |     |     |
 * v08---v09---v10---v11
 * |      |     |     |
 * v04---v05---v06---v07
 * |      |     |     |
 * v00---v01---v02---v03
 */
const _slicedIndices = [
  0, 1, 4, 5, 4, 1,
  1, 2, 5, 6, 5, 2,
  2, 3, 6, 7, 6, 3,
  4, 5, 8, 9, 8, 5,
  5, 6, 9, 10, 9, 6,
  6, 7, 10, 11, 10, 7,
  8, 9, 12, 13, 12, 9,
  9, 10, 13, 14, 13, 10,
  10, 11, 14, 15, 14, 11
];

const _fullRadialIndices = [
  0, 1, 2,
  0, 3, 4,
  0, 5, 6,
  0, 7, 8,
  0, 9, 10
];

function _reallocVertexData(type, fillType) {
  let vertexCount = 4;
  let indices = null;

  if (type === 'simple') {
    vertexCount = 4;
    indices = _simpleIndices;
  } else if (type === 'sliced') {
    vertexCount = 16;
    indices = _slicedIndices;
  } else if (type === 'filled') {
    if (fillType === 'radial') {
      vertexCount = 11;
      // do not specify it coz it may changes
      // indices = _fullRadialIndices;
    } else {
      vertexCount = 4;
      indices = _simpleIndices;
    }
  }

  let lposList = new Array(vertexCount);
  let wposList = new Array(vertexCount);
  let uvs = new Array(vertexCount);
  let color = color4.create();

  for (let i = 0; i < vertexCount; ++i) {
    wposList[i] = vec3.create();
    lposList[i] = vec3.create();
    uvs[i] = vec3.create();
  }

  return {
    wposList,
    lposList,
    uvs,
    color,
    indices,
  };
}

function _genSimpleVerts(out, sprite, x, y, w, h) {
  vec3.set(out.lposList[0], x, y, 0);
  vec3.set(out.lposList[1], x + w, y, 0);
  vec3.set(out.lposList[2], x, y + h, 0);
  vec3.set(out.lposList[3], x + w, y + h, 0);

  vec3.copy(out.uvs[0], sprite.uvs[0]);
  vec3.copy(out.uvs[1], sprite.uvs[3]);
  vec3.copy(out.uvs[2], sprite.uvs[12]);
  vec3.copy(out.uvs[3], sprite.uvs[15]);

  return out;
}

function _genSlicedVerts(out, sprite, x, y, w, h) {
  // x0, x1, x2, x3
  let xScale = 1.0;
  let yScale = 1.0;

  if (sprite._left + sprite._right > w) {
    xScale = w / (sprite._left + sprite._right);
  }
  if (sprite._bottom + sprite._top > h) {
    yScale = h / (sprite._bottom + sprite._top);
  }

  _x_tmp[0] = x;
  _x_tmp[1] = x + sprite._left * xScale;
  _x_tmp[2] = x + w - sprite._right * xScale;
  _x_tmp[3] = x + w;

  _y_tmp[0] = y;
  _y_tmp[1] = y + sprite._bottom * yScale;
  _y_tmp[2] = y + h - sprite._top * yScale;
  _y_tmp[3] = y + h;

  for (let row = 0; row < 4; ++row) {
    for (let column = 0; column < 4; ++column) {
      vec3.set(out.lposList[row * 4 + column], _x_tmp[column], _y_tmp[row], 0.0);
    }
  }

  for (let i = 0; i < 16; ++i) {
    vec3.copy(out.uvs[i], sprite.uvs[i]);
  }

  return out;
}

function _genFilledHorizontalVerts(out, sprite, x, y, w, h, start, range) {
  start = start < 0 ? 0 : start;
  start = start > 1 ? 1 : start;
  range = range < 0 ? 0 : range;
  let end = (range + start > 1) ? 1 : (range + start);

  vec3.set(out.lposList[0], w * start + x, y, 0);
  vec3.set(out.lposList[1], w * end + x, y, 0);
  vec3.set(out.lposList[2], w * start + x, y + h, 0);
  vec3.set(out.lposList[3], w * end + x, y + h, 0);

  vec3.lerp(out.uvs[0], sprite.uvs[0], sprite.uvs[3], start);
  vec3.lerp(out.uvs[1], sprite.uvs[0], sprite.uvs[3], end);
  vec3.lerp(out.uvs[2], sprite.uvs[12], sprite.uvs[15], start);
  vec3.lerp(out.uvs[3], sprite.uvs[12], sprite.uvs[15], end);

  return out;
}

function _genFilledVerticalVerts(out, sprite, x, y, w, h, start, range) {
  start = start < 0 ? 0 : start;
  start = start > 1 ? 1 : start;
  range = range < 0 ? 0 : range;
  let end = (range + start > 1) ? 1 : (range + start);

  vec3.set(out.lposList[0], x, y + h * start, 0);
  vec3.set(out.lposList[1], w + x, y + h * start, 0);
  vec3.set(out.lposList[2], x, y + h * end, 0);
  vec3.set(out.lposList[3], w + x, y + h * end, 0);

  vec3.lerp(out.uvs[0], sprite.uvs[0], sprite.uvs[12], start);
  vec3.lerp(out.uvs[1], sprite.uvs[3], sprite.uvs[15], start);
  vec3.lerp(out.uvs[2], sprite.uvs[0], sprite.uvs[12], end);
  vec3.lerp(out.uvs[3], sprite.uvs[3], sprite.uvs[15], end);

  return out;
}

// [0,PI * 2)
function _getVertAngle(start, end) {
  let placementX, placementY;
  placementX = end.x - start.x;
  placementY = end.y - start.y;

  if (placementX === 0 && placementY === 0) {
    return NaN;
  } else if (placementX === 0) {
    if (placementY > 0) {
      return Math.PI * 0.5;
    } else {
      return Math.PI * 1.5;
    }
  } else {
    let angle = Math.atan(placementY / placementX);
    if (placementX < 0) {
      angle += Math.PI;
    }

    return angle;
  }
}

function _getInsectedPoints(quadInfo, center, angle, points, uvs) {
  // left bottom, right, top
  let left = quadInfo.left;
  let right = quadInfo.right;
  let top = quadInfo.top;
  let bottom = quadInfo.bottom;
  let sinAngle = Math.sin(angle);
  let cosAngle = Math.cos(angle);
  let tanAngle, cotAngle;
  if (Math.cos(angle) !== 0) {
    tanAngle = sinAngle / cosAngle;
    // calculate right and left
    if ((left - center.x) * cosAngle > 0) {
      let yleft = center.y + tanAngle * (left - center.x);
      points[3].x = left;
      points[3].y = yleft;

      vec3.lerp(uvs[3], quadInfo.uvbl, quadInfo.uvtl, (yleft - quadInfo.bottom) / (quadInfo.top - quadInfo.bottom));
    }
    if ((right - center.x) * cosAngle > 0) {
      let yright = center.y + tanAngle * (right - center.x);

      points[1].x = right;
      points[1].y = yright;
      vec3.lerp(uvs[1], quadInfo.uvbr, quadInfo.uvtr, (yright - quadInfo.bottom) / (quadInfo.top - quadInfo.bottom));
    }

  }

  if (Math.sin(angle) !== 0) {
    cotAngle = cosAngle / sinAngle;
    // calculate  top and bottom
    if ((top - center.y) * sinAngle > 0) {
      let xtop = center.x + cotAngle * (top - center.y);
      points[2].x = xtop;
      points[2].y = top;

      vec3.lerp(uvs[2], quadInfo.uvtl, quadInfo.uvtr, (xtop - quadInfo.left) / (quadInfo.right - quadInfo.left));
    }
    if ((bottom - center.y) * sinAngle > 0) {
      let xbottom = center.x + cotAngle * (bottom - center.y);
      points[0].x = xbottom;
      points[0].y = bottom;

      vec3.lerp(uvs[0], quadInfo.uvbl, quadInfo.uvbr, (xbottom - quadInfo.left) / (quadInfo.right - quadInfo.left));
    }

  }
}

const _genFilledRadialVerts = (() => {

  let intersectionPoints1 = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  let intersectionPoints2 = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  let intersectionUVs1 = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  let intersectionUVs2 = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];

  let center = vec3.create();
  let centerUVs = vec3.create();
  // quad vert data, in counter clockwise order
  let quadVertPoses = [vec3.create(), vec3.create(), vec3.create(), vec3.create()];
  let quadVertAngles = [0, 0, 0, 0];
  let uvXaxis = vec3.create();
  let uvYaxis = vec3.create();

  // proto of raw quads
  let rawQuad = {
    left: 0,
    right: 100,
    bottom: 0,
    top: 100,
    uvbl: vec3.new(0, 0, 0),
    uvbr: vec3.new(1, 0, 0),
    uvtl: vec3.new(0, 1, 0),
    uvtr: vec3.new(1, 1, 0)
  };

  let quadUVs = new Array(4);

  return (out, sprite, x, y, w, h, start, range, cx, cy) => {

    vec3.sub(uvXaxis, sprite.uvs[3], sprite.uvs[0]);
    vec3.sub(uvYaxis, sprite.uvs[12], sprite.uvs[0]);
    quadUVs[0] = sprite.uvs[0];
    quadUVs[1] = sprite.uvs[3];
    quadUVs[2] = sprite.uvs[15];
    quadUVs[3] = sprite.uvs[12];
    // fast return ,generate simple mesh if range is bigger than 1
    if (range >= 1) {
      _genSimpleVerts(out, sprite, x, y, w, h);
      out.indices = _simpleIndices;
      return out;
    }
    out.indices = _fullRadialIndices;

    // clamp range, center and start
    range = range < 0 ? 0 : range;
    while (start >= 1) {
      start = start - 1;
    }
    while (start < 0) {
      start = start + 1;
    }
    start = start * Math.PI * 2;
    range = range * Math.PI * 2;
    let end = start + range;

    center.x = cx < 0 ? 0 : cx;
    center.y = cy < 0 ? 0 : cy;
    center.x = cx > 1 ? 1 : cx;
    center.y = cy > 1 ? 1 : cy;

    vec3.copy(centerUVs, sprite.uvs[0]);
    centerUVs.x += uvXaxis.x * cx;
    centerUVs.y += uvXaxis.y * cx;
    centerUVs.x += uvYaxis.x * cy;
    centerUVs.y += uvYaxis.y * cy;

    center.x = center.x * w;
    center.y = center.y * h;
    // fill quad vertice
    quadVertPoses[0].x = 0; quadVertPoses[0].y = 0;
    quadVertPoses[1].x = w; quadVertPoses[1].y = 0;
    quadVertPoses[2].x = w; quadVertPoses[2].y = h;
    quadVertPoses[3].x = 0; quadVertPoses[3].y = h;
    for (let index = 0; index < 4; ++index) {
      quadVertAngles[index] = _getVertAngle(center, quadVertPoses[index]);
    }
    rawQuad.left = 0; rawQuad.bottom = 0;
    rawQuad.right = w; rawQuad.top = h;
    rawQuad.uvbl = sprite.uvs[0]; rawQuad.uvbr = sprite.uvs[3];
    rawQuad.uvtl = sprite.uvs[12]; rawQuad.uvtr = sprite.uvs[15];
    _getInsectedPoints(rawQuad, center, start, intersectionPoints1, intersectionUVs1);
    _getInsectedPoints(rawQuad, center, end, intersectionPoints2, intersectionUVs2);
    // iterate each edge
    // center should be added
    let vertCount = 1;
    let triangleCount = 0;
    vec3.copy(out.lposList[0], center);
    vec3.copy(out.uvs[0], centerUVs);

    for (let index = 0; index < 4; ++index) {
      let startAngle = quadVertAngles[index];
      let endAngle = quadVertAngles[(index + 1) % 4];
      if (endAngle < startAngle) endAngle += Math.PI * 2;
      startAngle -= Math.PI * 2;
      endAngle -= Math.PI * 2;

      for (let testIndex = 0; testIndex < 3; ++testIndex) {
        if (startAngle >= end) {
          // all out
        } else if (startAngle >= start) {
          if (endAngle >= end) {
            // startAngle to fillEnd
            vec3.copy(out.lposList[vertCount], quadVertPoses[index]);
            vec3.copy(out.lposList[vertCount + 1], intersectionPoints2[index]);

            vec3.copy(out.uvs[vertCount], quadUVs[index]);
            vec3.copy(out.uvs[vertCount + 1], intersectionUVs2[index]);

            vertCount += 2;
            triangleCount += 1;
          } else {

            vec3.copy(out.lposList[vertCount], quadVertPoses[index]);
            vec3.copy(out.lposList[vertCount + 1], quadVertPoses[(index + 1) % 4]);

            vec3.copy(out.uvs[vertCount], quadUVs[index]);
            vec3.copy(out.uvs[vertCount + 1], quadUVs[(index + 1) % 4]);

            vertCount += 2;
            triangleCount += 1;
          }
        } else {
          // startAngle < fillStarts
          if (endAngle <= start) {
            // all out
          } else if (endAngle <= end) {
            // fillStart to endAngle
            vec3.copy(out.lposList[vertCount], intersectionPoints1[index]);
            vec3.copy(out.lposList[vertCount + 1], quadVertPoses[(index + 1) % 4]);

            vec3.copy(out.uvs[vertCount], intersectionUVs1[index]);
            vec3.copy(out.uvs[vertCount + 1], quadUVs[(index + 1) % 4]);

            vertCount += 2;
            triangleCount += 1;
          } else {
            // fillStart to fillEnd
            vec3.copy(out.lposList[vertCount], intersectionPoints1[index]);
            vec3.copy(out.lposList[vertCount + 1], intersectionPoints2[index]);

            vec3.copy(out.uvs[vertCount], intersectionUVs1[index]);
            vec3.copy(out.uvs[vertCount + 1], intersectionUVs2[index]);

            vertCount += 2;
            triangleCount += 1;
          }
        }
        // add 2 * PI
        startAngle += Math.PI * 2;
        endAngle += Math.PI * 2;
      }
    }

    for (let index = 0; index < vertCount; ++index) {
      out.lposList[index].x += x;
      out.lposList[index].y += y;
    }

    // fill empty verts to generate degraded triangles
    for (let index = vertCount; index < out.lposList.length; ++index) {
      vec3.copy(out.lposList[index], out.lposList[0]);
    }

    return out;
  };
})();

export default class ImageComponent extends WidgetComponent {
  onInit() {
    this._cachedVertexData = _reallocVertexData(this._type, this._fillType);
    this._vertexDataDirty = true;

    if (this._material === null) {
      this._material = this._app.assets.get('builtin-material-sprite');
    }
  }

  _onRectChanged() {
    this._vertexDataDirty = true;
  }

  calcVertexData(x, y, w, h) {
    if (this._vertexDataDirty) {
      this._vertexDataDirty = false;
      let sprite = this._sprite;
      if (sprite === null) {
        sprite = this._app.assets.get('default-sprite');
      }

      color4.copy(this._cachedVertexData.color, this._color);

      if (this._type === 'simple') {
        _genSimpleVerts(this._cachedVertexData, sprite, x, y, w, h);
      } else if (this._type == 'sliced') {
        _genSlicedVerts(this._cachedVertexData, sprite, x, y, w, h);
      } else if (this._type === 'filled') {
        if (this._fillType === 'radial') {
          _genFilledRadialVerts(this._cachedVertexData, sprite, x, y, w, h, this._fillStart, this._fillRange, this._fillCenter.x, this._fillCenter.y);
        } else if (this._fillType === 'vertical') {
          _genFilledVerticalVerts(this._cachedVertexData, sprite, x, y, w, h, this._fillStart, this._fillRange);
        } else {
          _genFilledHorizontalVerts(this._cachedVertexData, sprite, x, y, w, h, this._fillStart, this._fillRange);
        }
      }
    }

    this._entity.getWorldMatrix(_m4_tmp);

    for (let i = 0; i < this._cachedVertexData.lposList.length; ++i) {
      let lpos = this._cachedVertexData.lposList[i];
      let wpos = this._cachedVertexData.wposList[i];

      vec3.transformMat4(wpos, lpos, _m4_tmp);
    }

    return this._cachedVertexData;
  }
}

ImageComponent.schema = {
  material: {
    type: 'asset',
    default: null,
    set(val) {
      if (val === this._material) {
        return;
      }

      this._material = val;
    }
  },

  type: {
    type: 'enums',
    default: 'simple',
    options: ['simple', 'sliced', 'filled'],
    set(val) {
      if (val === this._type) {
        return;
      }

      this._type = val;
      this._cachedVertexData = _reallocVertexData(this._type, this._fillType);
      this._vertexDataDirty = true;
    }
  },

  fillType: {
    type: 'enums',
    default: 'horizontal',
    options: ['horizontal', 'vertical', 'radial'],
    set(val) {
      if (val === this._fillType) {
        return;
      }

      this._fillType = val;
      if (this._type === 'filled') {
        this._cachedVertexData = _reallocVertexData(this._type, this._fillType);
        this._vertexDataDirty = true;
      }
    }
  },

  fillStart: {
    type: 'number',
    default: 0.2,
    set(val) {
      if (val === this._fillStart) {
        return;
      }

      this._fillStart = val;
      if (this._type === 'filled') {
        this._vertexDataDirty = true;
      }
    }
  },

  fillRange: {
    type: 'number',
    default: 0.8,
    set(val) {
      if (val === this._fillRange) {
        return;
      }

      this._fillRange = val;
      if (this._type === 'filled') {
        this._vertexDataDirty = true;
      }
    }
  },

  fillCenter: {
    type: 'vec2',
    default: [0.5, 0.5],
    set(val) {
      if (vec2.equals(this._fillCenter, val)) {
        return;
      }

      this._fillCenter = val;
      if (this._type === 'filled' && this._fillType === 'radial') {
        this._vertexDataDirty = true;
      }
    }
  },

  sprite: {
    type: 'asset',
    default: null,
    set(val) {
      if (val === this._sprite) {
        return;
      }

      this._sprite = val;
      this._vertexDataDirty = true;
    }
  },

  color: {
    type: 'color4',
    default: [1, 1, 1, 1],
    set(val) {
      if (color4.equals(this._color, val)) {
        return;
      }

      this._color = val;
      this._vertexDataDirty = true;
    }
  }
};