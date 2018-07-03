import { randomUnitVector, particleEmitZAxis, randomSortArray, randomSign, randomPointBetweenSphere, randomPointInCube, randomPointBetweenCircleAtFixedAngle, fixedAngleUnitVector2 } from "../particle-general-function";
import { vec3, vec2, random, randomRange, mat4, quat, clamp, repeat, pingPong } from "../../../vmath";

let _intermediVec = vec3.zero();
let _intermediArr = new Array();
const _unitBoxExtent = vec3.new(0.5, 0.5, 0.5);

export default class ShapeModule {

  constructor() {
    this.mat = mat4.create();
    this.quat = quat.create();
  }

  onInit(ps) {
    this.constructMat();
    this.particleSystem = ps;
    this.lastTime = ps._time;
    this.totalAngle = 0;
  }

  constructMat() {
    quat.fromEuler(this.quat, this._rotation.x, this._rotation.y, this._rotation.z);
    mat4.fromRTS(this.mat, this.quat, this._position, this._scale);
  }

  emit(p) {
    switch (this._shapeType) {
      case 'box':
        boxEmit(this._emitFrom, this._boxThickness, p.position, p.velocity);
        break;
      case 'circle':
        circleEmit(this._radius, this._radiusThickness, this.generateArcAngle(), p.position, p.velocity);
        break;
      case 'cone':
        coneEmit(this._emitFrom, this._radius, this._radiusThickness, this.generateArcAngle(), this._angle, this._length, p.position, p.velocity);
        break;
      case 'sphere':
        sphereEmit(this._emitFrom, this._radius, this._radiusThickness, p.position, p.velocity);
        break;
      case 'hemisphere':
        hemisphereEmit(this._emitFrom, this._radius, this._radiusThickness, p.position, p.velocity);
        break;
      default:
        console.warn(this._shapeType + ' shapeType is not supported by ShapeModule.');
    }
    if (this._randomPositionAmount > 0) {
      p.position.x += randomRange(-this._randomPositionAmount, this._randomPositionAmount);
      p.position.y += randomRange(-this._randomPositionAmount, this._randomPositionAmount);
      p.position.z += randomRange(-this._randomPositionAmount, this._randomPositionAmount);
    }
    vec3.transformQuat(p.velocity, p.velocity, this.quat);
    vec3.transformMat4(p.position, p.position, this.mat);
    if (this._sphericalDirectionAmount > 0) {
      let sphericalVel = vec3.normalize(_intermediVec, p.position);
      vec3.lerp(p.velocity, p.velocity, sphericalVel, this._sphericalDirectionAmount);
    }
    this.lastTime = this.particleSystem._time;
  }

  generateArcAngle() {
    if (this._arcMode === 'random') {
      return randomRange(0, this._arc);
    }
    let angle = this.totalAngle + 2 * Math.PI * this._arcSpeed.evaluate(this.particleSystem._time) * (this.particleSystem._time - this.lastTime);
    this.totalAngle = angle;
    if (this._arcSpread !== 0) {
      angle = Math.floor(angle / (this._arc * this._arcSpread)) * this._arc * this._arcSpread;
    }
    switch (this._arcMode) {
      case 'loop':
        return repeat(angle, this._arc);
      case 'pingPong':
        return pingPong(angle, this._arc);
    }
  }
}

function sphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
  switch (emitFrom) {
    case 'volume':
      randomPointBetweenSphere(pos, radius * (1 - radiusThickness), radius);
      vec3.copy(dir, pos);
      vec3.normalize(dir, dir);
      break;
    case 'shell':
      randomUnitVector(pos);
      vec3.scale(pos, radius);
      vec3.copy(dir, pos);
      break;
    default:
      console.warn(emitFrom + ' is not supported for sphere emitter.');
  }
}

function hemisphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
  switch (emitFrom) {
    case 'volume':
      randomPointBetweenSphere(pos, radius * (1 - radiusThickness), radius);
      if (pos.z > 0) {
        pos.z *= -1;
      }
      vec3.copy(dir, pos);
      vec3.normalize(dir, dir);
      break;
    case 'shell':
      randomUnitVector(pos);
      vec3.scale(pos, radius);
      if (pos.z < 0) {
        pos.z *= -1;
      }
      vec3.copy(dir, pos);
      break;
    default:
      console.warn(emitFrom + ' is not supported for hemisphere emitter.');
  }
}

function coneEmit(emitFrom, radius, radiusThickness, theta, angle, length, pos, dir) {
  switch (emitFrom) {
    case 'base':
      randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
      vec2.scale(dir, pos, Math.sin(angle));
      dir.z = -Math.cos(angle) * radius;
      pos.z = 0;
      break;
    case 'shell':
      fixedAngleUnitVector2(pos, theta);
      vec2.scale(dir, pos, Math.sin(angle));
      dir.z = -Math.cos(angle);
      vec2.scale(pos, pos, radius);
      pos.z = 0;
      break;
    case 'volume':
      randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
      vec2.scale(dir, pos, Math.sin(angle));
      dir.z = -Math.cos(angle) * radius;
      vec3.normalize(dir, dir);
      pos.z = 0;
      vec3.add(pos, pos, vec3.scale(_intermediVec, dir, length * random() / -dir.z));
      break;
    default:
      console.warn(emitFrom + ' is not supported for cone emitter.');
  }
}

function boxEmit(emitFrom, boxThickness, pos, dir) {
  switch (emitFrom) {
    case 'volume':
      randomPointInCube(pos, _unitBoxExtent);
      // randomPointBetweenCube(pos, vec3.multiply(_intermediVec, _unitBoxExtent, boxThickness), _unitBoxExtent);
      break;
    case 'shell':
      _intermediArr.splice(0, _intermediArr.length);
      _intermediArr.push(randomRange(-0.5, 0.5));
      _intermediArr.push(randomRange(-0.5, 0.5));
      _intermediArr.push(randomSign() * 0.5);
      randomSortArray(_intermediArr);
      applyBoxThickness(_intermediArr, boxThickness);
      pos.set( _intermediArr[0], _intermediArr[1], _intermediArr[2]);
      break;
    case 'edge':
      _intermediArr.splice(0, _intermediArr.length);
      _intermediArr.push(randomRange(-0.5, 0.5));
      _intermediArr.push(randomSign() * 0.5);
      _intermediArr.push(randomSign() * 0.5);
      randomSortArray(_intermediArr);
      applyBoxThickness(_intermediArr, boxThickness);
      pos.set( _intermediArr[0], _intermediArr[1], _intermediArr[2]);
      break;
    default:
      console.warn(emitFrom + ' is not supported for box emitter.');
  }
  vec3.copy(dir, particleEmitZAxis);
}

function circleEmit(radius, radiusThickness, theta, pos, dir) {
  randomPointBetweenCircleAtFixedAngle(pos, radius * (1 - radiusThickness), radius, theta);
  vec3.normalize(dir, pos);
}

function applyBoxThickness(pos, thickness) {
  if (thickness.x > 0) {
    pos[0] += 0.5 * randomRange(-thickness.x, thickness.x);
    pos[0] = clamp(pos[0], -0.5, 0.5);
  }
  if (thickness.y > 0) {
    pos[1] += 0.5 * randomRange(-thickness.y, thickness.y);
    pos[1] = clamp(pos[0], -0.5, 0.5);
  }
  if (thickness.z > 0) {
    pos[2] += 0.5 * randomRange(-thickness.z, thickness.z);
    pos[2] = clamp(pos[0], -0.5, 0.5);
  }
}



ShapeModule.schema = {
  enable: {
    type: 'boolean',
    default: false
  },

  shapeType: {
    type: 'enums',
    options: [
      'box',
      'circle',
      'cone',
      'sphere',
      'hemisphere'
    ],
    default: 'box'
  },

  emitFrom: {
    type: 'enums',
    options: [
      'base',
      'edge',
      'shell',
      'volume'
    ],
    default: 'base'
  },

  position: {
    type: 'vec3',
    default: [0, 0, 0],
    set(val) {
      this._position = val;
      this.constructMat();
    }
  },

  rotation: {
    type: 'vec3',
    default: [0, 0, 0],
    set(val) {
      this._rotation = val;
      this.constructMat();
    }
  },

  scale: {
    type: 'vec3',
    default: [1, 1, 1],
    set(val) {
      this._scale = val;
      this.constructMat();
    }
  },

  alignToDirection: {
    type: 'boolean',
    default: false
  },

  randomDirectionAmount: {
    type: 'number',
    default: 0
  },

  sphericalDirectionAmount: {
    type: 'number',
    default: 0
  },

  randomPositionAmount: {
    type: 'number',
    default: 0
  },

  radius: {
    type: 'number',
    default: 0
  },

  radiusThickness: {
    type: 'number',
    default: 0
  },

  arc: {
    type: 'number',
    default: 0
  },

  arcMode: {
    type: 'enums',
    options: [
      'random',
      'loop',
      'pingPong',
      // 'burstSpread' currently not supported
    ],
    default: 'random'
  },

  arcSpread: {
    type: 'number',
    default: 0
  },

  arcSpeed: {
    type: 'CurveRange',
    default: null
  },

  angle: {
    type: 'number',
    default: 0
  },

  length: {
    type: 'number',
    default: 0
  },

  boxThickness: {
    type: 'vec3',
    default: [0, 0, 0]
  }
};