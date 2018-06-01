import { vec3, random, randomRange } from '../../../vmath';

export default class HemisphereShape {

  constructor () {
    this._normalDir = vec3.new(0, 1, 0);
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
    if (out.z < 0.0) {
      out.z *= -1.0;
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

HemisphereShape.schema = {
  radius: {
    type: 'number',
    default: 5,
  },

  emitFromShell: {
    type: 'boolean',
    default: false,
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
  }
};