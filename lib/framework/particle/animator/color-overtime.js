import { color4 } from '../../../vmath';

export default class ColorOvertimeModule {
  animate(particle) {
    if (this._enable) {
      color4.multiply(particle.color, particle.startColor, this._color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, particle.randomSeed));
    }
  }
}

ColorOvertimeModule.schema = {
  enable: {
    type: 'boolean',
    default: false
  },

  color: {
    type: 'GradientRange',
    default: null
  }
};