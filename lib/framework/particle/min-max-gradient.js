export default class MinMaxGradient {

}

MinMaxGradient.schema = {
  gradient: {
    type: 'Gradient',
    default: null,
  },

  gradientMin: {
    type: 'Gradient',
    default: null,
  },

  gradientMax: {
    type: 'Gradient',
    default: null,
  },

  mode: {
    type: 'enums',
    default: 'gradient',
    options: [
      'gradient',
      'randomBetweenTwoGradients'
    ]
  }
};