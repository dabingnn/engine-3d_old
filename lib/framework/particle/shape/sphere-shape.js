import { vec3, random, randomRange } from 'vmath';

export default class SphereShape {
  constructor() {
    this._curEmitPos = vec3.create();
  }

  generateEmitPosition() {
    let out = vec3.create();
    let phi = randomRange(0.0, 2.0 * Math.PI);
    let cosTheta = randomRange(-1.0, 1.0);
    let sinTheta = Math.sqrt(1.0 - cosTheta * cosTheta);
    if (this._emitFromShell) {
      vec3.set(out,
        this._radius * sinTheta * Math.cos(phi),
        this._radius * sinTheta * Math.sin(phi),
        this._radius * cosTheta
      );
    } else {
      let randomRadius = this._radius * Math.pow(random(), 1.0 / 3.0);
      vec3.set(out,
        randomRadius * sinTheta * Math.cos(phi),
        randomRadius * sinTheta * Math.sin(phi),
        randomRadius * cosTheta
      );
    }

    vec3.copy(this._curEmitPos, out);
    return out;
  }

  generateEmitDirection() {
    // TODO: randomize direction according to randomizeDirection property.
    if (true) {
      return this._curEmitPos;
    } else {
      return this.generateEmitPosition();
    }
  }

}

SphereShape.schema = {
  radius: {
    type: 'number',
    default: 5,
    set(val) {
      this._radius = val;
    }
  },

  emitFromShell: {
    type: 'boolean',
    default: false,
    set(val) {
      this._emitFromShell = val;
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
  }
};