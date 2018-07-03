import { lerp } from '../../../vmath';

export default class CurveRange {
  constructor() {

  }

  evaluate(time, rndRatio) {
    switch (this._mode) {
      case 'constant':
        return this._constant;
      case 'curve':
        return this._curve.evaluate(time) * this._multiplier;
      case 'twoCurves':
        return lerp(this._curveMin.evaluate(time), this._curveMax.evaluate(time), rndRatio) * this._multiplier;
      case 'twoConstants':
        return lerp(this._constantMin, this._constantMax, rndRatio);
    }
  }
}

CurveRange.schema = {
  mode: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'twoCurves',
      'twoConstants'
    ],
  },
  curve: {
    type: 'AnimationCurve',
    default: null
  },
  curveMin: {
    type: 'AnimationCurve',
    default: null
  },
  curveMax: {
    type: 'AnimationCurve',
    default: null
  },
  constant: {
    type: 'number',
    default: 0
  },
  constantMin: {
    type: 'number',
    default: 0
  },
  constantMax: {
    type: 'number',
    default: 0
  },
  multiplier: {
    type: 'number',
    default: 1
  }
};
