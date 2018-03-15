import { vec3, randomRange } from 'vmath';

export default class EdgeShape {
  constructor() {
  }

  generateEmitPosition() {
    let out = vec3.create();
    vec3.set(out,
      randomRange(-this._radius, this.radius),
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
    set(val) {
      this._radius = val;
    }
  },

  alignToDirection: {
    type: 'boolean',
    default: false,
    set(val) {
      this._alignToDirection = val;
    }
  },

  randomizeDirection: { // 0.0 ~ 1.0
    type: 'number',
    default: 0.0,
    set(val) {
      this._randomizeDirection = val;
    }
  },

  spherizeDirection: { // 0.0 ~ 1.0
    type: 'number',
    default: 0.0,
    set(val) {
      this._spherizeDirection = val;
    }
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
    set(val) {
      this._mode = val;
    }
  },

  spread: { // 0.0 ~ 1.0
    type: 'number',
    default: 0.0,
    set(val) {
      this._spread = val;
    }
  }
};