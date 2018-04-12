export default class ColorKey {

}

ColorKey.schema = {
  color: {
    type: 'color3',
    default: [1, 1, 1],
  },

  time: {
    type: 'number',
    default: 0.0,
  }
};