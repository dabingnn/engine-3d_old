// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { Component } from '../../ecs';
import { RecyclePool } from '../../memop';
import Particle from './particle';
import { vec3, color4, vec2, mat4, quat } from '../../vmath';
import registry from '../../misc/registry';
import Gradient,{ColorKey,AlphaKey} from './animator/gradient';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';
import ParticleSystemRenderer from './renderer/particle-system-renderer';
import SizeOvertimeModule from './animator/size-overtime';
import ColorOverLifetimeModule from './animator/color-overtime';
import VelocityOvertimeModule from './animator/velocity-overtime';
import ForceOvertimeModule from './animator/force-overtime';
import LimitVelocityOvertimeModule from './animator/limit-velocity-overtime';
import RotationOvertimeModule from './animator/rotation-overtime';
import TextureAnimationModule from './animator/texture-animation';
import ShapeModule from './emitter/shape-module';
import Burst from './burst';
import { particleEmitZAxis } from './particle-general-function';

registry.registerClass('Burst', Burst);
registry.registerClass('ColorKey', ColorKey);
registry.registerClass('AlphaKey', AlphaKey);
registry.registerClass('Gradient', Gradient);
registry.registerClass('GradientRange', GradientRange);
registry.registerClass("CurveRange", CurveRange);
registry.registerClass("SizeOvertimeModule",SizeOvertimeModule);
registry.registerClass("ColorOverLifetimeModule",ColorOverLifetimeModule);
registry.registerClass("ParticleSystemRenderer",ParticleSystemRenderer);
registry.registerClass("VelocityOvertimeModule",VelocityOvertimeModule);
registry.registerClass("ForceOvertimeModule",ForceOvertimeModule);
registry.registerClass("LimitVelocityOvertimeModule",LimitVelocityOvertimeModule);
registry.registerClass("RotationOvertimeModule",RotationOvertimeModule);
registry.registerClass("TextureAnimationModule",TextureAnimationModule);
registry.registerClass("ShapeModule",ShapeModule);

let _world_mat = mat4.create();

export default class ParticleSystemComponent extends Component {
  constructor() {
    super();

    // internal status
    this._isPlaying = false;
    this._isPaused = false;
    this._isStopped = true;
    this._isEmitting = false;

    this._time = 0.0;  // playback position in seconds.
    this._emitRateTimeCounter = 0.0;
    this._emitRateDistanceCounter = 0.0;
    this._oldWPos = vec3.create();
    this._curWPos = vec3.create();

    this._customData1 = vec2.create();
    this._customData2 = vec2.create();

    this._subEmitters = []; // array of { emitter: ParticleSystemComponent, type: 'birth', 'collision' or 'death'}
    this._vertAttrs = [];
    this._vertAttrFlags = {
      position: true,
      uv: true,
      uv0: true,
      color: true,
      normal: false,
      tangent: false,
      custom1: false,
      custom2: false,
      color0: false,
    };
  }

  onInit() {
    this._particles = new RecyclePool(() => {
      return new Particle(this);
    }, this._capacity);

    // HACK, TODO
    this._renderer.onInit(this);
    if (this._shapeModule.enable) {
      this._shapeModule.onInit(this);
    }

    this._entity.getWorldPos(this._oldWPos);
    vec3.copy(this._curWPos, this._oldWPos);

    this._system.add(this);
  }

  onDestroy() {
    this._renderer._model.destroy();
    this._system.remove(this);
  }

  onEnable() {
    this._app.scene.addModel(this._renderer._model);
    if (this._playOnAwake) {
      this.play();
    }
  }

  onDisable() {
    this._app.scene.removeModel(this._renderer._model);
  }

  // TODO: fastforward current particle system by simulating particles over given period of time, then pause it.
  // simulate(time, withChildren, restart, fixedTimeStep) {

  // }

  play() {
    if (this._isPaused) {
      this._isPaused = false;
    }
    if (this._isStopped) {
      this._isStopped = false;
    }

    this._time = 0.0;
    this._emitRateTimeCounter = 0.0;
    this._emitRateDistanceCounter = 0.0;

    this._isPlaying = true;

    // prewarm
    if (this._prewarm) {
      this._prewarmSystem();
    }
  }

  pause() {
    if (this._isStopped) {
      console.warn('pause(): particle system is already stopped.');
      return;
    }
    if (this._isPlaying) {
      this._isPlaying = false;
    }

    this._isPaused = true;
  }

  stop() {
    if (this._isPlaying) {
      this._isPlaying = false;
    }
    if (this._isPaused) {
      this._isPaused = false;
    }

    this.clear();
    this._time = 0.0;
    this._emitRateTimeCounter = 0.0;
    this._emitRateDistanceCounter = 0.0;

    this._isStopped = true;
  }

  // remove all particles from current particle system.
  clear() {
    this._particles.reset();
    this._renderer._model.clear();
  }

  emit(count, emitParams = null) {
    if (emitParams !== null) {
      // TODO:
    }
    
    for (let i = 0; i < count; ++i) {
      if (this._particles.length >= this._capacity) {
        return;
      }

      let particle = this._particles.add();

      if (this._shapeModule.enable) {
        this._shapeModule.emit(particle);
      }
      else {
        vec3.set(particle.position, 0, 0, 0);
        vec3.copy(particle.velocity, particleEmitZAxis);
      }

      vec3.scale(particle.velocity, particle.velocity, this._startSpeed.evaluate(this._time / this._duration));

      switch(this._simulationSpace) {
        case 'local':
          break;
        case 'world': {
            this._entity.getWorldMatrix(_world_mat);
            vec3.transformMat4(particle.position, particle.position, _world_mat);
            let worldRot = quat.create();
            this._entity.getWorldRot(worldRot);
            vec3.transformQuat(particle.velocity,particle.velocity,worldRot);
          }
          break;
        case 'custom':
          // TODO:
          break;
      }

      // subEmitter
      // if (this._subEmitters.length > 0) {
      //   for (let idx = 0; idx < this._subEmitters.length; ++idx) {
      //     let subEmitter = this._subEmitters[idx];
      //     if (subEmitter.type === 'birth') {
      //       // TODO: clone subEmitter
      //       vec3.copy(subEmitter.emitter.entity.lpos, particle.position);
      //       subEmitter.emitter.play();
      //     }
      //   }
      // }

      // apply startRotation. now 2D only.
      vec3.set(particle.rotation,this._startRotation.evaluate(this._time/this._duration),0,0);

      // apply startSize. now 2D only.
      vec3.set(particle.startSize,this._startSize.evaluate(this._time/this._duration),0,0);
      vec3.copy(particle.size,particle.startSize);

      // apply startColor.
      color4.copy(particle.startColor,this._startColor.evaluate(this._time/this._duration));
      color4.copy(particle.color,particle.startColor);

      // apply startLifetime.
      particle.startLifetime = this._startLifetime.evaluate(this._time/this._duration);
      particle.remainingLifetime = particle.startLifetime;

    } // end of particles forLoop.
  }

  // simulation, update particles.
  _updateParticles(dt) {
    this._entity.getWorldMatrix(_world_mat);
    if(this._velocityOvertimeModule.enable) {
      this._velocityOvertimeModule.update(this._simulationSpace,_world_mat);
    }
    if(this._forceOvertimeModule.enable) {
      this._forceOvertimeModule.update(this._simulationSpace,_world_mat);
    }
    for (let i = 0; i < this._particles.length; ++i) {
      let p = this._particles.data[i];
      p.remainingLifetime -= dt;
      vec3.set(p.animatedVelocity,0,0,0);

      if(p.remainingLifetime < 0.0) {
        // subEmitter
        // if (this._subEmitters.length > 0) {
        //   for (let idx = 0; idx < this._subEmitters.length; ++idx) {
        //     let subEmitter = this._subEmitters[idx];
        //     if (subEmitter.type === 'death') {
        //       vec3.copy(subEmitter.emitter.entity.lpos, p.position);
        //       subEmitter.emitter.play();
        //     }
        //   }
        // }

        this._particles.remove(i);
        --i;
        continue;
      }

      p.velocity.y -= this._gravityModifier.evaluate(1-p.remainingLifetime/p.startLifetime) * 9.8 * dt; // apply gravity.
      if(this._sizeOvertimeModule.enable) {
        this._sizeOvertimeModule.animate(p);
      }
      if(this._colorOverLifetimeModule.enable) {
        this._colorOverLifetimeModule.animate(p);
      }
      if(this._forceOvertimeModule.enable) {
        this._forceOvertimeModule.animate(p,dt);
      }
      if(this._velocityOvertimeModule.enable) {
        this._velocityOvertimeModule.animate(p);
      }
      else {
        vec3.copy(p.ultimateVelocity,p.velocity);
      }
      if(this._limitVelocityOvertimeModule.enable) {
        this._limitVelocityOvertimeModule.animate(p);
      }
      if(this._rotationOvertimeModule.enable) {
        this._rotationOvertimeModule.animate(p,dt);
      }
      if(this._textureAnimationModule.enable) {
        this._textureAnimationModule.animate(p);
      }
      vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.
    }
  }

  // initialize particle system as though it had already completed a full cycle.
  _prewarmSystem() {
    this._startDelay.mode = 'constant'; // clear startDelay.
    this._startDelay.constant = 0;
    let dt = 1.0; // should use varying value?
    let cnt = this._duration / dt;
    for (let i = 0; i < cnt; ++i) {
      this._time += dt;
      this._emit(dt);
      this._updateParticles(dt);
    }
  }

  // internal function
  _emit(dt) {
    // emit particles.
    let startDelay = this._startDelay.evaluate();
    if (this._time > startDelay) {
      if (!this._isStopped) {
        this._isEmitting = true;
      }
      if (this._time > (this._duration + startDelay)) {
        // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
        // this._emitRateTimeCounter = 0.0;
        // this._emitRateDistanceCounter = 0.0;
        if (!this._loop) {
          this._isEmitting = false;
          this._isStopped = true;
        }
      }

      // emit by rateOverTime
      this._emitRateTimeCounter += this._rateOverTime.evaluate(this._time/this._duration) * dt;
      if (this._emitRateTimeCounter > 1 && this._isEmitting) {
        let emitNum = Math.floor(this._emitRateTimeCounter);
        this._emitRateTimeCounter -= emitNum;
        this.emit(emitNum);
      }
      // emit by rateOverDistance
      this._entity.getWorldPos(this._curWPos);
      let distance = vec3.distance(this._curWPos, this._oldWPos);
      vec3.copy(this._oldWPos, this._curWPos);
      this._emitRateDistanceCounter += distance * this._rateOverDistance.evaluate(this._time/this._duration);
      if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
        let emitNum = Math.floor(this._emitRateDistanceCounter);
        this._emitRateDistanceCounter -= emitNum;
        this.emit(emitNum);
      }

      // bursts
      for (let i = 0; i < this._bursts.length; ++i) {
        this._bursts[i].update(this, dt);
      }
    }
  }

  tick(dt) {
    let scaledDeltaTime = dt * this._simulationSpeed;
    if (this._isPlaying) {
      this._time += scaledDeltaTime;

      // excute emission
      this._emit(scaledDeltaTime);

      // simulation, update particles.
      this._updateParticles(scaledDeltaTime);

      // update render data
      this.renderer._updateRenderData();
    }
  }

  addSubEmitter(subEmitter) {
    this._subEmitters.push(subEmitter);
  }

  removeSubEmitter(idx) {
    this._subEmitters.remove(idx);
  }

  addBurst(burst) {
    this._bursts.push(burst);
  }

  removeBurst(idx) {
    this._bursts.remove(idx);
  }

  getParticleCount() {
    return this._particles.length;
  }

  setCustomData1(x, y) {
    vec2.set(this._customData1, x, y);
  }

  setCustomData2(x, y) {
    vec2.set(this._customData2, x, y);
  }

  get isPlaying() {
    return this._isPlaying;
  }

  get isPaused() {
    return this._isPaused;
  }

  get isStopped() {
    return this._isStopped;
  }

  get isEmitting() {
    return this._isEmitting;
  }

  get time() {
    return this._time;
  }
}

ParticleSystemComponent.schema = {

  // main module properties
  capacity: {
    type: 'int',
    default: 2000,
  },

  startColor:{
    type:'GradientRange',
    default:{
      'mode':'color',
      'color':[1,1,1,1]
    }
  },

  startSize:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':1.0
    }
  },

  startSpeed:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':5.0
    }
  },

  startRotation:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':0.0
    }
  },

  startDelay:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':0.0
    }
  },

  startLifetime:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':5.0
    }
  },

  duration: {
    type: 'number',
    default: 5.0,
  },

  loop: {
    type: 'boolean',
    default: true,
  },

  prewarm: {
    type: 'boolean',
    default: false,
    set(val) {
      if (val === true && this._loop === false) {
        // console.warn('prewarm only works if loop is also enabled.');
      }
      this._prewarm = val;
    }
  },

  simulationSpace: {
    type: 'enums',
    default: 'local',
    options: [
      'local',
      'world',
      'custom'
    ],
    set(val) {
      if (val === 'world') {
        this._renderer._material.define("USE_WORLD_SPACE", true);
      } else {
        this._renderer._material.define("USE_WORLD_SPACE", false);
      }
      this._simulationSpace = val;
    }
  },

  simulationSpeed: {
    type: 'number',
    default: 1.0,
  },

  playOnAwake: {
    type: 'boolean',
    default: false,
  },

  gravityModifier:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':0.0
    }
  },

  // emission module
  rateOverTime:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':10.0
    }
  },

  rateOverDistance:{
    type:'CurveRange',
    default:{
      'mode':'constant',
      'constant':10.0
    }
  },

  bursts: {
    type: 'Burst',
    default: [],
    array: true,
  },

  // color over lifetime module
  colorOverLifetimeModule: {
    type: 'ColorOverLifetimeModule',
    default: null,
  },

  // shpae module
  shapeModule:{
    type:"ShapeModule",
    default:null
  },

  // particle system renderer
  renderer: {
    type:'ParticleSystemRenderer',
    default:null
  },

  // size over lifetime module
  sizeOvertimeModule: {
    type:'SizeOvertimeModule',
    default:null
  },

  velocityOvertimeModule: {
    type:'VelocityOvertimeModule',
    default:null
  },

  forceOvertimeModule: {
    type:'ForceOvertimeModule',
    default:null
  },

  limitVelocityOvertimeModule: {
    type:'LimitVelocityOvertimeModule',
    default:null
  },

  rotationOvertimeModule: {
    type:'RotationOvertimeModule',
    default:null
  },

  textureAnimationModule: {
    type:'TextureAnimationModule',
    default:null
  }
};