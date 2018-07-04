import renderer from '../../../renderer';
import { vec3, vec4, vec2 } from '../../../vmath';
import gfx from '../../../gfx';
import Material from '../../../assets/material';

let _vertAttrsCache = {
  position: vec3.zero(),
  uv: vec4.zero(),
  uv0: vec2.zero(),
  color: vec4.zero(),
  color0: vec4.zero(),
  normal: vec3.zero(),
  tangent: vec3.zero(),
};

let _name2VertAttrs = {
  'position': { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
  'uv': { name: gfx.ATTR_UV, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
  'uv0': { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 }, // size, rotateAngle
  'color': { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4 },
  'normal': { name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }, // 3D only
  'tangent': { name: gfx.ATTR_TANGENT, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }, // 3D only
  'custom1': { name: gfx.ATTR_UV1, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
  'custom2': { name: gfx.ATTR_UV2, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
};

let _uvs = [
  0, 0, // bottom-left
  1, 0, // bottom-right
  0, 1, // top-left
  1, 1  // top-right
];

export default class ParticleSystemRenderer {
  constructor() {
    this._model = null;

    this._vertAttrs = [];
    this._vertAttrFlags = {
      position: true,
      uv: true,
      uv0: true,
      color: true,
      normal: false,
      tangent: false,
      custom1: false,
      custom2: false,
      color0: false,
    };
    this.frameTile = vec2.new(1, 1);
  }

  setVertexAtrributes(attrs) {
    // clear vertex attribute flags
    for (let key in this._vertAttrFlags) {
      this._vertAttrFlags[key] = false;
    }

    for (let i = 0; i < attrs.length; ++i) {
      let attr = _name2VertAttrs[attrs[i]];
      if (attr !== undefined) {
        this._vertAttrs.push(attr);
        this._vertAttrFlags[attrs[i]] = true;
      } else {
        console.error('vertex attribute name wrong.');
      }
    }
    this._model.setVertexAttributes(this._vertAttrs);
  }

  onInit(ps) {
    this.particleSystem = ps;
    if (this._material === null || this._material === undefined) {
      this._material = new Material();
      this._material.effect = ps._app.assets.get('builtin-effect-particle-premultiply-blend');
    }
    this._updateMaterialParams();
    this._updateModel();
  }

  _updateMaterialParams() {
    if (!this.particleSystem) {
      return;
    }
    if (this.particleSystem._simulationSpace === 'world') {
      this._material.define("USE_WORLD_SPACE", true);
    } else {
      this._material.define("USE_WORLD_SPACE", false);
    }

    if (this._renderMode === 'billboard') {
      this._material.define('USE_BILLBOARD', true);
      this._material.define('USE_STRETCHED_BILLBOARD', false);
      this._material.define('USE_HORIZONTAL_BILLBOARD', false);
      this._material.define('USE_VERTICAL_BILLBOARD', false);
    } else if (this._renderMode === 'stretchedBillboard') {
      this._material.define('USE_BILLBOARD', false);
      this._material.define('USE_STRETCHED_BILLBOARD', true);
      this._material.define('USE_HORIZONTAL_BILLBOARD', false);
      this._material.define('USE_VERTICAL_BILLBOARD', false);
      this._material.setProperty('velocityScale', this._velocityScale);
      this._material.setProperty('lengthScale', this._lengthScale);
    } else if (this._renderMode === 'horizontalBillboard') {
      this._material.define('USE_BILLBOARD', false);
      this._material.define('USE_STRETCHED_BILLBOARD', false);
      this._material.define('USE_HORIZONTAL_BILLBOARD', true);
      this._material.define('USE_VERTICAL_BILLBOARD', false);
    } else if (this._renderMode === 'verticalBillboard') {
      this._material.define('USE_BILLBOARD', false);
      this._material.define('USE_STRETCHED_BILLBOARD', false);
      this._material.define('USE_HORIZONTAL_BILLBOARD', false);
      this._material.define('USE_VERTICAL_BILLBOARD', true);
    } else {
      console.warn(`particle system renderMode ${this._renderMode} not support.`);
    }

    if (this.particleSystem.textureAnimationModule.enable) {
      this._material.setProperty('frameTile', vec2.set(this.frameTile, this.particleSystem.textureAnimationModule.numTilesX, this.particleSystem.textureAnimationModule.numTilesY));
    }
    else {
      this._material.setProperty('frameTile', this.frameTile);
    }
  }

  _updateModel() {
    if (!this.particleSystem) {
      return;
    }
    if (this._model === null) {
      this._model = new renderer.ParticleBatchModel(this.particleSystem._app.device, this.particleSystem._capacity);
      this._model.setNode(this.particleSystem._entity);
    }
    this._model.setEffect(this._material ? this._material.effectInst : null);
    if (this._renderMode === 'stretchedBillboard') {
      this._model.enableStretchedBillboard();
      this._vertAttrFlags.color0 = true;
    } else {
      this._model.disableStretchedBillboard();
      this._vertAttrFlags.color0 = false;
    }
  }

  // internal function
  _updateRenderData() {
    // update vertex buffer
    let idx = 0;
    for (let i = 0; i < this.particleSystem._particles.length; ++i) {
      let p = this.particleSystem._particles.data[i];
      if (this.particleSystem.textureAnimationModule.enable) {
        _vertAttrsCache.uv.z = p.frameIndex;
      }
      else {
        _vertAttrsCache.uv.z = 0;
      }
      for (let j = 0; j < 4; ++j) { // four verts per particle.
        let attrs = [];
        if (this._vertAttrFlags.position) {
          attrs.push(vec3.set(_vertAttrsCache.position, p.position.x, p.position.y, p.position.z));
        }
        if (this._vertAttrFlags.uv) {
          _vertAttrsCache.uv.x = _uvs[2 * j];
          _vertAttrsCache.uv.y = _uvs[2 * j + 1];
          attrs.push(_vertAttrsCache.uv);
        }
        if (this._vertAttrFlags.uv0) {
          attrs.push(vec2.set(_vertAttrsCache.uv0, p.size.x, p.rotation.x));
        }
        if (this._vertAttrFlags.color) {
          attrs.push(vec4.set(_vertAttrsCache.color, p.color.r, p.color.g, p.color.b, p.color.a));
        }
        // TODO: other attrs.
        if (this._vertAttrFlags.custom1) {
          attrs.push(this._customData1);
        }
        if (this._vertAttrFlags.custom2) {
          attrs.push(this._customData2);
        }

        if (this._vertAttrFlags.color0) {
          attrs.push(vec3.set(_vertAttrsCache.color0, p.ultimateVelocity.x, p.ultimateVelocity.y, p.ultimateVelocity.z));
        }

        this._model.addParticleVertexData(idx++, attrs);
      }
    }

    // because we use index buffer, per particle index count = 6.
    this._model.updateIA(this.particleSystem._particles.length * 6);
  }
}

ParticleSystemRenderer.schema = {
  material: {
    type: 'asset',
    default: null,
    set(val) {
      if (this._material === val) {
        return;
      }

      this._material = val;
      this._updateMaterialParams();
      this._updateModel();
    },
    parse(app, value) {
      if (typeof value === 'string') {
        let matCopy = new Material();
        matCopy.copy(app.assets.get(value));
        return matCopy;
      }
      return value;
    }
  },

  renderMode: {
    type: 'enums',
    default: 'billboard',
    options: [
      'billboard',
      'stretchedBillboard',
      'horizontalBillboard',
      'verticalBillboard',
      'mesh', // TODO:
    ],
    set(val) {
      if (this._renderMode === val) {
        return;
      }
      this._renderMode = val;
      this._updateMaterialParams();
      this._updateModel();
    }
  },

  velocityScale: {
    type: 'number',
    default: 1.0,
    set(val) {
      this._velocityScale = val;
      this._updateMaterialParams();
      this._updateModel();
    }
  },

  lengthScale: {
    type: 'number',
    default: 0.4,
    set(val) {
      this._lengthScale = val;
      this._updateMaterialParams();
      this._updateModel();
    }
  }
};
