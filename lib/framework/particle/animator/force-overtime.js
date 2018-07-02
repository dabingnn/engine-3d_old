import { vec3, quat } from '../../../vmath';
import { calculateTransform } from '../particle-general-function';

export default class ForceOvertimeModule {

  constructor() {
    this.rotation = quat.create();
  }

  update(space, worldTransform) {
    this.needTransform = calculateTransform(space, this._space, worldTransform, this.rotation);
  }

  animate(p, dt) {
    let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
    let force = vec3.new(this._x.evaluate(normalizedTime, p.randomSeed), this._y.evaluate(normalizedTime, p.randomSeed), this._z.evaluate(normalizedTime, p.randomSeed));
    if (this.needTransform) {
      vec3.transformQuat(force, force, this.rotation);
    }
    vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);
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
    ]
  },
  // TODO:currently not supported
  randomized: {
    type: 'boolean',
    default: false
  }
};