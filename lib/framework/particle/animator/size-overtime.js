import { vec3 } from '../../../vmath';
export default class SizeOvertimeModule {

  animate(particle) {
    if (!this._separateAxes) {
      vec3.scale(particle.size, particle.startSize, this._size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, particle.randomSeed));
    }
  }
}

SizeOvertimeModule.schema = {
  enable: {
    type: 'boolean',
    default: false
  },

  separateAxes: {
    type: 'boolean',
    default: false
  },

  size: {
    type: 'CurveRange',
    default: null
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
  }
};