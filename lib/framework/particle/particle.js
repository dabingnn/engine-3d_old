import { vec3, color4 } from 'vmath';

export default class Particle {
  constructor(particleSystem) {
    this._particleSystem = particleSystem;
    this._position = vec3.new(0, 0, 0);
    this._velocity = vec3.new(0, 0, 0);
    this._animatedVelocity = vec3.new(0, 0, 0);
    this._initialVelocity = vec3.new(0, 0, 0);
    this._axisOfRotation = vec3.new(0, 0, 0);
    this._rotation = vec3.new(0, 0, 0);
    this._angularVelocity = vec3.new(0, 0, 0);
    this._startSize = vec3.new(0, 0, 0);
    this._startColor = color4.new(1, 1, 1, 1);
    this._randomSeed = 0; // uint
    this._lifetime = 0.0;
    this._startLifetime = 0.0;
    this._emitAccumulator0 = 0.0;
    this._emitAccumulator1 = 0.0;
  }

}