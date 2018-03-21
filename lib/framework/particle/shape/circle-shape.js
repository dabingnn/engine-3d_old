import { vec3, random, toRadian } from 'vmath';

export default class CircleShape {
  constructor() {
    this._normalDir = vec3.new(0, 1, 0);
  }

  generateEmitPosition() {
    let out = vec3.create();
    let angle = random() * this._arc;
    if (this._emitFromEdge) {
      vec3.set(out,
        -this._radius * Math.cos(angle),
        this._radius * Math.sin(angle),
        0
      );
    } else {
      let randomRadius = this._radius * Math.pow(random(), 1.0 / 2.0);
      vec3.set(out,
        -randomRadius * Math.cos(angle),
        randomRadius * Math.sin(angle),
        0
      );
    }

    vec3.normalize(this._normalDir, out);
    return out;
  }

  generateEmitDirection() {
    // TODO: randomize direction according to randomizeDirection property.
    if (true) {
      return this._normalDir;
    } else {
      return vec3.normalize(this._normalDir, this.generateEmitPosition());
    }
  }

}

CircleShape.schema = {
  radius: {
    type: 'number',
    default: 20,
    set(val) {
      this._radius = val;
    }
  },

  arc: {
    type: 'number', // 0 ~ 360
    default: 2.0 * Math.PI,
    set(val) {
      this._arc = toRadian(val);
    }
  },

  emitFromEdge: {
    type: 'boolean',
    default: false,
    set(val) {
      this._emitFromEdge = val;
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