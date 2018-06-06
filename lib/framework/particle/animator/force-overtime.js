import { vec3, mat4 } from '../../../vmath';

export default class ForceOvertimeModule {

  constructor() {
    this.transform = mat4.create();
  }

  update(space, worldTransform) {
    this.systemSpace = space;
    this.worldTransform = worldTransform;
    this.needTransform = this.calculateTransform();
  }

  animate(p, dt) {
    let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
    let force = vec3.new(this._x.evaluate(normalizedTime), this._y.evaluate(normalizedTime), this._z.evaluate(normalizedTime));
    if (this.needTransform) {
      vec3.transformMat4(force, force, this.transform);
    }
    vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
  }

  calculateTransform() {
    if (this._space !== this.systemSpace) {
      if (this.systemSpace === 'world') {
        mat4.copy(this.transform, this.worldTransform);
      }
      else {
        mat4.invert(this.transform, this.worldTransform);
      }
      return true;
    }
    else {
      mat4.identity(this.transform);
      return false;
    }
  }
}

ForceOvertimeModule.schema = {
  enable: {
    type: 'boolean',
    default: false
  },

  x: {
    type: 'CurveRange',
    default: null
  },

  y: {
    type: 'CurveRange',
    default: null
  },

  z: {
    type: 'CurveRange',
    default: null
  },

  space: {
    type: 'enums',
    default: 'local',
    options: [
      'local',
      'world'
    ],
    set(val) {
      this._space = val;
      this.needTransform = this.calculateTransform();
    }
  },
  // TODO:currently not supported
  randomized: {
    type: 'boolean',
    default: false
  }
};