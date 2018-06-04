import { vec3, randomRange } from '../../../vmath';

export default class EdgeShape {

  generateEmitPosition() {
    let out = vec3.create();
    vec3.set(out,
      randomRange(-this._radius, this._radius),
      0,
      0
    );
    return out;
  }

  generateEmitDirection() {
    return vec3.new(0, 1, 0);
  }

}

EdgeShape.schema = {
  radius: {
    type: 'number',
    default: 20,
  },

  alignToDirection: {
    type: 'boolean',
    default: false,
  },

  randomizeDirection: { // 0.0 ~ 1.0
    type: 'number',
    default: 0.0,
  },

  spherizeDirection: { // 0.0 ~ 1.0
    type: 'number',
    default: 0.0,
  },

  // TODO:
  mode: {
    type: 'enums',
    default: 'random',
    options: [
      'random',
      'loop',
      'ping-pong',
      'burst-spread'
    ],
  },

  spread: { // 0.0 ~ 1.0
    type: 'number',
    default: 0.0,
  }
};