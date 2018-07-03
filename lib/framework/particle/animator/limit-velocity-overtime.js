import { vec3, lerp } from '../../../vmath';

export default class LimitVelocityOvertimeModule {

  constructor() {
  }

  animate(p) {
    let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
    let dampedVel = vec3.zero();
    if (this._separateAxes) {
      dampedVel.set(
        dampenBeyondLimit(p.ultimateVelocity.x, this._limitX.evaluate(normalizedTime), this._dampen),
        dampenBeyondLimit(p.ultimateVelocity.y, this._limitY.evaluate(normalizedTime), this._dampen),
        dampenBeyondLimit(p.ultimateVelocity.z, this._limitZ.evaluate(normalizedTime), this._dampen));
    }
    else {
      vec3.normalize(dampedVel, p.ultimateVelocity);
      vec3.scale(dampedVel, dampedVel, dampenBeyondLimit(p.ultimateVelocity.length(), this._limit.evaluate(normalizedTime), this._dampen));
    }
    vec3.copy(p.ultimateVelocity, dampedVel);
  }

}

function dampenBeyondLimit(vel, limit, dampen) {
  let sgn = Math.sign(vel);
  let abs = Math.abs(vel);
  if (abs > limit) {
    abs = lerp(abs, limit, dampen);
  }
  return abs * sgn;
}

LimitVelocityOvertimeModule.schema = {
  enable: {
    type: 'boolean',
    default: false
  },

  limitX: {
    type: 'CurveRange',
    default: null
  },

  limitY: {
    type: 'CurveRange',
    default: null
  },

  limitZ: {
    type: 'CurveRange',
    default: null
  },

  limit: {
    type: 'CurveRange',
    default: null
  },

  dampen: {
    type: 'number',
    default: 0
  },

  separateAxes: {
    type: 'boolean',
    default: false
  },

  space: {
    type: 'enums',
    default: 'local',
    options: [
      'local',
      'world'
    ]
  },

  // TODO:functions related to drag are temporarily not supported
  drag: {
    type: 'CurveRange',
    default: null
  },

  multiplyDragByParticleSize: {
    type: 'boolean',
    default: false
  },

  multiplyDragByParticleVelocity: {
    type: 'boolean',
    default: false
  }
};