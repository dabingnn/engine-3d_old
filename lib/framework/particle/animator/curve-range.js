import { AnimationCurve } from '../../../geom-utils/curve'
import { randomRange } from '../../../vmath'
import registry from '../../../misc/registry'

export default class CurveRange {
  constructor() {

  }

  evaluate(time) {
    switch (this._mode) {
      case 'constant':
        return this._constant;
      case 'curve':
        return this._curve.evaluate(time)*this._multiplier;
      case 'twoCurves':
        return randomRange(this._curveMin.evaluate(time), this._curveMax.evaluate(time))*this._multiplier;
      case 'twoConstants':
        return randomRange(this._constantMin, this._constantMax);
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
}
