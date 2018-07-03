import { vec3, randomRange, randomRangeInt } from '../../../vmath';

export default class BoxShape {

  generateEmitPosition() {
    let out = vec3.zero();
    if (this._emitFrom === 'volume') {
      out.set(
        randomRange(-0.5, 0.5) * this._boxScale.x,
        randomRange(-0.5, 0.5) * this._boxScale.y,
        randomRange(-0.5, 0.5) * this._boxScale.z
      );

    } else if (this._emitFrom === 'shell') {
      let plane = randomRangeInt(0, 5); // determine which plane to emit from.
      switch(plane) {
        case 0:
          out.set(
            this._boxScale.x / 2,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
        case 1:
          out.set(
            -this._boxScale.x / 2,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
        case 2:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            this._boxScale.y / 2,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
        case 3:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            -this._boxScale.y / 2,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
        case 4:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            this._boxScale.z / 2
          );
          break;
        case 5:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            -this._boxScale.z / 2
          );
          break;
      }

    } else if (this._emitFrom === 'edge') {
      let edge = randomRangeInt(0, 11); // determine which edge to emit from.
      switch(edge) {
        case 0:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            this._boxScale.y / 2,
            this._boxScale.z / 2
          );
          break;
        case 1:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            -this._boxScale.y / 2,
            this._boxScale.z / 2
          );
          break;
        case 2:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            this._boxScale.y / 2,
            -this._boxScale.z / 2
          );
          break;
        case 3:
          out.set(
            randomRange(-0.5, 0.5) * this._boxScale.x,
            -this._boxScale.y / 2,
            -this._boxScale.z / 2
          );
          break;
        case 4:
          out.set(
            this._boxScale.x / 2,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            this._boxScale.z / 2
          );
          break;
        case 5:
          out.set(
            -this._boxScale.x / 2,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            this._boxScale.z / 2
          );
          break;
        case 6:
          out.set(
            this._boxScale.x / 2,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            -this._boxScale.z / 2
          );
          break;
        case 7:
          out.set(
            -this._boxScale.x / 2,
            randomRange(-0.5, 0.5) * this._boxScale.y,
            -this._boxScale.z / 2
          );
          break;
        case 8:
          out.set(
            this._boxScale.x / 2,
            this._boxScale.y / 2,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
        case 9:
          out.set(
            -this._boxScale.x / 2,
            this._boxScale.y / 2,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
        case 10:
          out.set(
            this._boxScale.x / 2,
            -this._boxScale.y / 2,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
        case 11:
          out.set(
            -this._boxScale.x / 2,
            -this._boxScale.y / 2,
            randomRange(-0.5, 0.5) * this._boxScale.z
          );
          break;
      }

    } else {
      console.warn('emitFrom mode not support.');
    }

    return out;
  }

  generateEmitDirection() {
    // TODO: randomizeDirection, spherizeDirection.
    return vec3.new(0, 0, -1);
  }

}

BoxShape.schema = {

  boxScale:{
    type:'vec3',
    default:[1,1,1]
  },

  emitFrom: {
    type: 'enums',
    default: 'volume',
    options: [
      'volume',
      'shell',
      'edge',
    ],
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