import { randomRange } from '../../../vmath'
import registry from '../../../misc/registry'
import Gradient from './gradient'

export default class GradientRange {

  evaluate(time) {
    switch (this._mode) {
      case 'color':
        return this._color;
      case 'twoColors':
        return randomRange(this._colorMin, this._colorMax);
      case 'randomColor':
        return this._gradient.randomColor();
      case 'gradient':
        return this._gradient.evaluate(time);
      case 'twoGradients':
        return randomRange(this._gradientMin.evaluate(time), this._gradientMax.evaluate(time));
    }
  }
}

GradientRange.schema = {
  mode: {
    type: 'enums',
    default: 'color',
    options: [
      'color',
      'gradient',
      'twoColors',
      'twoGradients',
      'randomColor'
    ]
  },

  color: {
    type: 'color4',
    default: [1, 1, 1, 1]
  },

  colorMin: {
    type: 'color4',
    default: [1, 1, 1, 1]
  },

  colorMax: {
    type: 'color4',
    default: [1, 1, 1, 1]
  },

  gradient: {
    type: 'Gradient',
    default: null
  },

  gradientMin: {
    type: 'Gradient',
    default: null
  },

  gradientMax: {
    type: 'Gradient',
    default: null
  }
}
