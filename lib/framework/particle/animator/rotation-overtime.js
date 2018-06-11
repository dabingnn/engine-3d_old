
export default class RotationOvertimeModule {
  constructor() {

  }

  animate(p, dt) {
    let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
    if (!this._separateAxes) {
      p.rotation.x += this._z.evaluate(normalizedTime) * dt;
    }
  }
}

RotationOvertimeModule.schema = {

  enable: {
    type: 'boolean',
    default: false
  },

  separateAxes: {
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
  }
};