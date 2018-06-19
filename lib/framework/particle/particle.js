import { vec3, color4 } from '../../vmath';

export default class Particle {
  constructor(particleSystem) {
    this.particleSystem = particleSystem;
    this.position = vec3.new(0, 0, 0);
    this.velocity = vec3.new(0, 0, 0);
    this.animatedVelocity = vec3.new(0, 0, 0);
    this.ultimateVelocity = vec3.new(0, 0, 0);
    this.angularVelocity = vec3.new(0, 0, 0);
    this.axisOfRotation = vec3.new(0, 0, 0);
    this.rotation = vec3.new(0, 0, 0);
    this.startSize = vec3.new(0, 0, 0);
    this.size = vec3.create();
    this.startColor = color4.new(1, 1, 1, 1);
    this.color = color4.create();
    this.randomSeed = 0; // uint
    this.remainingLifetime = 0.0;
    this.startLifetime = 0.0;
    this.emitAccumulator0 = 0.0;
    this.emitAccumulator1 = 0.0;
    this.frameIndex = 0.0;
  }
}