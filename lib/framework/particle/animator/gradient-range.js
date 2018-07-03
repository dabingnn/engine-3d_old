import { randomRange, color4 } from '../../../vmath';

export default class GradientRange {

  evaluate(time) {
    switch (this._mode) {
      case 'color':
        return this._color;
      case 'twoColors':
        return color4.set(this._color, randomRange(this._colorMin.r, this._colorMax.r), randomRange(this._colorMin.g, this._colorMax.g), randomRange(this._colorMin.b, this._colorMax.b), randomRange(this._colorMin.a, this._colorMax.a));
      case 'randomColor':
        return this._gradient.randomColor();
      case 'gradient':
        return this._gradient.evaluate(time);
      case 'twoGradients':
        this._colorMin = this._gradientMin.evaluate(time);
        this._colorMax = this._gradientMax.evaluate(time);
        return color4.set(this._color, randomRange(this._colorMin.r, this._colorMax.r), randomRange(this._colorMin.g, this._colorMax.g), randomRange(this._colorMin.b, this._colorMax.b), randomRange(this._colorMin.a, this._colorMax.a));
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
};
