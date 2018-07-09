import WidgetComponent from './widget-component';
import { vec2, vec3, mat4, color4 } from '../../vmath';

let _m4_tmp = mat4.create();

function _reallocVertexData() {
  let vertexCount = 4;
  let indices = [
    0, 1, 2, 3, 2, 1
  ];

  let lposList = new Array(vertexCount);
  let wposList = new Array(vertexCount);
  let uvs = new Array(vertexCount);
  let color = color4.new(1, 1, 1, 1);

  uvs[0] = vec2.new(0, 0);
  uvs[1] = vec2.new(1, 0);
  uvs[2] = vec2.new(0, 1);
  uvs[3] = vec2.new(1, 1);

  for (let i = 0; i < vertexCount; ++i) {
    wposList[i] = vec3.zero();
    lposList[i] = vec3.zero();
  }

  return {
    wposList,
    lposList,
    uvs,
    color,
    indices,
  };
}

export default class MaskComponent extends WidgetComponent {
  onInit() {
    this._cachedVertexData = _reallocVertexData();
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

      vec3.set(this._cachedVertexData.lposList[0], x, y, 0);
      vec3.set(this._cachedVertexData.lposList[1], x + w, y, 0);
      vec3.set(this._cachedVertexData.lposList[2], x, y + h, 0);
      vec3.set(this._cachedVertexData.lposList[3], x + w, y + h, 0);
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

MaskComponent.schema = {
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

  sprite: {
    type: 'asset',
    default: null,
    set(val) {
      if (val !== this._sprite) {
        return;
      }

      this._sprite = val;
    }
  }
};