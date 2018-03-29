// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import Material from '../../assets/material';
import gfx from 'gfx.js';
import { RecyclePool } from 'memop';
import Particle from './particle';
import BoxShape from './shape/box-shape';
import CircleShape from './shape/circle-shape';
import EdgeShape from './shape/edge-shape';
import SphereShape from './shape/sphere-shape';
import HemisphereShape from './shape/hemisphere-shape';
import { vec3, random, randomRange, color4, vec2, toRadian, mat4 } from 'vmath';

let _world_mat = mat4.create();

let _vertAttrsCache = {
  position: vec3.create(),
  uv: vec2.create(),
  uv0: vec2.create(),
  color: color4.create(),
  color0: color4.create(),
  normal: vec3.create(),
  tangent: vec3.create(),
};

let _name2VertAttrs = {
  'position': { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
  'uv': { name: gfx.ATTR_UV, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
  'uv0': { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 }, // size, rotateAngle
  'color': { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4 },
  'normal': { name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }, // 3D only
  'tangent': { name: gfx.ATTR_TANGENT, type: gfx.ATTR_TYPE_FLOAT32, num: 3 }, // 3D only
  'custom1': {name: gfx.ATTR_UV1, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
  'custom2': {name: gfx.ATTR_UV2, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
};

let _uvs = [
  0, 0, // bottom-left
  1, 0, // bottom-right
  0, 1, // top-left
  1, 1  // top-right
];

export default class ParticleSystemComponent extends Component {
  constructor() {
    super();

    this._model = null;
    this._shape = null;

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

    this._initBursts();
    this._updateShape();
    // HACK, TODO
    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._app.assets.get('builtin-effect-particle-premultiply-blend');
    }
    this._updateMaterialParams();
    this._updateModel();

    this._entity.getWorldPos(this._oldWPos);
    vec3.copy(this._curWPos, this._oldWPos);

    // apply startDelay.
    if (this._startDelayType === 'randomBetweenTwoConstants') {
      this._startDelay = randomRange(this._startDelayMin, this._startDelayMax);
    }

    // apply rateOverTime
    // TODO: other types.
    if (this._rateOverTimeType === 'randomBetweenTwoConstants') {
      this._rateOverTime = randomRange(this._rateOverTimeMin, this._rateOverTimeMax);
    }

    // apply gravityModifier.
    // TODO: other types.
    if (this._gravityModifierType === 'randomBetweenTwoConstants') {
      this._gravityModifier = randomRange(this._gravityModifierMin, this._gravityModifierMax);
    }

    this._system.add(this);
  }

  onDestroy() {
    this._model.destroy();
    this._system.remove(this);
  }

  onEnable() {
    this._app.scene.addModel(this._model);
    if (this._playOnAwake) {
      this.play();
    }
  }

  onDisable() {
    this._app.scene.removeModel(this._model);
  }

  setVertexAtrributes(attrs) {
    // clear vertex attribute flags
    for (let key in this._vertAttrFlags) {
      this._vertAttrFlags[key] = false;
    }

    for (let i = 0; i < attrs.length; ++i) {
      let attr = _name2VertAttrs[attrs[i]];
      if (attr !== undefined) {
        this._vertAttrs.push(attr);
        this._vertAttrFlags[attrs[i]] = true;
      } else {
        console.error('vertex attribute name wrong.');
      }
    }
    this._model.setVertexAttributes(this._vertAttrs);
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
    this._model.clear();
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

      // apply position.
      switch(this._simulationSpace) {
        case 'local':
          vec3.copy(particle.position, this._shape.generateEmitPosition());
          break;
        case 'world': {
            let emitPos = this._shape.generateEmitPosition();
            this._entity.getWorldMatrix(_world_mat);
            vec3.transformMat4(emitPos, emitPos, _world_mat);
            vec3.copy(particle.position, emitPos);
          }
          break;
        case 'custom':
          // TODO:
          vec3.copy(particle.position, this._shape.generateEmitPosition());
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

      // apply startSpeed.
      switch(this._startSpeedType) {
        case 'constant':
          vec3.scale(particle.velocity,
            this._shape.generateEmitDirection(),
            this._startSpeed);
          break;
        case 'curve':
          // TODO:
          break;
        case 'randomBetweenTwoConstants':
          vec3.scale(particle.velocity,
            this._shape.generateEmitDirection(),
            randomRange(this._startSpeedMin, this._startSpeedMax));
            break;
        case 'randomBetweenTwoCurves':
          // TODO:
          break;
      }

      // apply startRotation. now 2D only.
      switch(this._startRotationType) {
        case 'constant':
          vec3.set(particle.rotation,
            this._startRotation,
            0,
            0
          );
          break;
        case 'curve':
          // TODO:
          break;
        case 'randomBetweenTwoConstants':
          vec3.set(particle.rotation,
            randomRange(this._startRotationMin, this._startRotationMax),
            0,
            0
          );
          break;
        case 'randomBetweenTwoCurves':
          // TODO:
          break;
      }

      // apply startSize. now 2D only.
      switch(this._startSizeType) {
        case 'constant':
          vec3.set(particle.startSize,
            this._startSize,
            0,
            0);
          break;
        case 'curve':
          // TODO:
          break;
        case 'randomBetweenTwoConstants':
          vec3.set(particle.startSize,
            randomRange(this._startSizeMin, this._startSizeMax),
            0,
            0);
          break;
        case 'randomBetweenTwoCurves':
          // TODO:
          break;
      }

      // apply startColor.
      switch(this._startColorType) {
        case 'color':
          color4.copy(particle.startColor, this._startColor);
          break;
        case 'gradient':
          // TODO:
          break;
        case 'randomBetweenTwoColors':
          // color4.lerp or randomize individual rgba ?
          color4.set(particle.startColor,
            randomRange(this._startColorMin.r, this._startColorMax.r),
            randomRange(this._startColorMin.g, this._startColorMax.g),
            randomRange(this._startColorMin.b, this._startColorMax.b),
            randomRange(this._startColorMin.a, this._startColorMax.a));
          break;
        case 'randomBetweenTwoGradients':
          // TODO:
          break;
        case 'randomColor':
          color4.set(particle.startColor,
            random(),
            random(),
            random(),
            random()
          );
          break;
      }

      // apply startLifetime.
      switch(this._startLifetimeType) {
        case 'constant':
          particle.remainingLifetime = this._startLifetime;
          break;
        case 'curve':
          // TODO:
          break;
        case 'randomBetweenTwoConstants':
          particle.remainingLifetime = randomRange(this._startLifetimeMin, this._startLifetimeMax);
          break;
        case 'randomBetweenTwoCurves':
          // TODO:
          break;
      }

    } // end of particles forLoop.
  }

  // simulation, update particles.
  _updateParticles(dt) {
    for (let i = 0; i < this._particles.length; ++i) {
      let p = this._particles.data[i];
      p.remainingLifetime -= dt;

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

      p.velocity.y -= this._gravityModifier * dt; // apply gravity.
      vec3.scaleAndAdd(p.position, p.position, p.velocity, dt); // apply velocity.
    }
  }

  // initialize particle system as though it had already completed a full cycle.
  _prewarmSystem() {
    this._startDelay = 0.0; // clear startDelay.
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
    if (this._time > this._startDelay) {
      if (!this._isStopped) {
        this._isEmitting = true;
      }
      if (this._time > (this._duration + this._startDelay)) {
        this._time = this._startDelay; // delay will not be applied from the second loop.(Unity)
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        if (!this._loop) {
          this._isEmitting = false;
          this._isStopped = true;
        }
      }

      // emit by rateOverTime
      this._emitRateTimeCounter += this._rateOverTime * dt;
      if (this._emitRateTimeCounter > 1 && this._isEmitting) {
        let emitNum = Math.floor(this._emitRateTimeCounter);
        this._emitRateTimeCounter -= emitNum;
        this.emit(emitNum);
      }
      // emit by rateOverDistance
      this._entity.getWorldPos(this._curWPos);
      let distance = vec3.distance(this._curWPos, this._oldWPos);
      vec3.copy(this._oldWPos, this._curWPos);
      this._emitRateDistanceCounter += distance * this._rateOverDistance;
      if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
        let emitNum = Math.floor(this._emitRateDistanceCounter);
        this._emitRateDistanceCounter -= emitNum;
        this.emit(emitNum);
      }

      // bursts
      this._updateBursts(dt);
    }
  }

  // internal function
  _updateRenderData() {
    // update vertex buffer
    let idx = 0;
    for (let i = 0; i < this._particles.length; ++i) {
      let p = this._particles.data[i];
      for (let j = 0; j < 4; ++j) { // four verts per particle.
        let attrs = [];
        if (this._vertAttrFlags.position) {
          attrs.push(vec3.set(_vertAttrsCache.position, p.position.x, p.position.y, p.position.z));
        }
        if (this._vertAttrFlags.uv) {
          attrs.push(vec2.set(_vertAttrsCache.uv, _uvs[2 * j], _uvs[2 * j + 1]));
        }
        if (this._vertAttrFlags.uv0) {
          attrs.push(vec2.set(_vertAttrsCache.uv0, p.startSize.x , p.rotation.x));
        }
        if (this._vertAttrFlags.color) {
          attrs.push(color4.set(_vertAttrsCache.color, p.startColor.r, p.startColor.g, p.startColor.b, p.startColor.a));
        }
        // TODO: other attrs.
        if (this._vertAttrFlags.custom1) {
          attrs.push(this._customData1);
        }
        if (this._vertAttrFlags.custom2) {
          attrs.push(this._customData2);
        }

        if (this._vertAttrFlags.color0) {
          let scale = this._velocityScale * vec3.length(p.velocity) + this._lengthScale;
          attrs.push(color4.set(_vertAttrsCache.color0, p.velocity.x, p.velocity.y, p.velocity.z, scale));
        }

        this._model.addParticleVertexData(idx++, attrs);
      }
    }

    // because we use index buffer, per particle index count = 6.
    this._model.updateIA(this._particles.length * 6);
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
      this._updateRenderData();
    }
  }

  addSubEmitter(subEmitter) {
    this._subEmitters.push(subEmitter);
  }

  removeSubEmitter(idx) {
    this._subEmitters.remove(idx);
  }

  addBurst(burst) {
    burst.time = burst.time !== undefined ? burst.time : 0.0;
    burst.minCount = burst.minCount !== undefined ? burst.minCount : 30;
    burst.maxCount = burst.maxCount !== undefined ? burst.maxCount : 30;
    burst.repeatCount = burst.repeatCount !== undefined ? burst.repeatCount : 1;
    burst.repeatInterval = burst.repeatInterval !== undefined ? burst.repeatInterval : 0.01;
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

  _initBursts() {
    for (let i = 0; i < this._bursts.length; ++i) {
      this._bursts[i]._curTime = this._bursts[i].time;
      this._bursts[i]._remainingCount = this._bursts[i].repeatCount;
    }
  }

  _updateBursts(dt) {
    for (let i = 0; i < this._bursts.length; ++i) {
      if (this._loop && this._bursts[i]._remainingCount === 0) {
        this._bursts[i]._remainingCount = this._bursts[i].repeatCount;
        this._bursts[i]._curTime = this._bursts[i].time;
      }
      if (this._bursts[i]._remainingCount > 0) {
        let preFrameTime = this._time - this._startDelay - dt;
        preFrameTime = (preFrameTime > 0.0) ? preFrameTime : 0.0;
        let curFrameTime = this._time - this._startDelay;
        if (this._bursts[i]._curTime >= preFrameTime && this._bursts[i]._curTime < curFrameTime) {
          this.emit(randomRange(this._bursts[i].minCount, this._bursts[i].maxCount));
          this._bursts[i]._curTime += this._bursts[i].repeatInterval;
          --this._bursts[i]._remainingCount;
        }
      }
    }
  }

  _updateModel() {
    if (this._model === null) {
      this._model = new renderer.ParticleBatchModel(this._app.device, this._capacity);
      this._model.setNode(this._entity);
    }
    this._model.setEffect(this._material ? this._material.effectInst : null);
    if (this._renderMode === 'stretchedBillboard') {
      this._model.enableStretchedBillboard();
      this._vertAttrFlags.color0 = true;
    } else {
      this._model.disableStretchedBillboard();
      this._vertAttrFlags.color0 = false;
    }
  }

  _updateMaterialParams() {
    if (this._simulationSpace === 'world') {
      this._material.define("USE_WORLD_SPACE", true);
    } else {
      this._material.define("USE_WORLD_SPACE", false);
    }

    if (this._renderMode === 'billboard') {
      this._material.define('USE_BILLBOARD', true);
      this._material.define('USE_STRETCHED_BILLBOARD', false);
      this._material.define('USE_HORIZONTAL_BILLBOARD', false);
      this._material.define('USE_VERTICAL_BILLBOARD', false);
    } else if (this._renderMode === 'stretchedBillboard') {
      this._material.define('USE_BILLBOARD', false);
      this._material.define('USE_STRETCHED_BILLBOARD', true);
      this._material.define('USE_HORIZONTAL_BILLBOARD', false);
      this._material.define('USE_VERTICAL_BILLBOARD', false);
    } else if (this._renderMode === 'horizontalBillboard') {
      this._material.define('USE_BILLBOARD', false);
      this._material.define('USE_STRETCHED_BILLBOARD', false);
      this._material.define('USE_HORIZONTAL_BILLBOARD', true);
      this._material.define('USE_VERTICAL_BILLBOARD', false);
    } else if (this._renderMode === 'verticalBillboard') {
      this._material.define('USE_BILLBOARD', false);
      this._material.define('USE_STRETCHED_BILLBOARD', false);
      this._material.define('USE_HORIZONTAL_BILLBOARD', false);
      this._material.define('USE_VERTICAL_BILLBOARD', true);
    } else {
      console.warn(`particle system renderMode ${this._renderMode} not support.`);
    }
  }

  _updateShape() {
    switch(this._shapeType) {
      case 'cone':
        // TODO:
        break;
      case 'coneShell':
        // TODO:
        break;
      case 'coneVolume':
        // TODO:
        break;
      case 'coneVolumeShell':
        // TODO:
        break;
      case 'box':
        this._shape = new BoxShape({
          boxX: this._boxSize.x,
          boxY: this._boxSize.y,
          boxZ: this._boxSize.z,
          emitFrom: 'volume',
        });
        break;
      case 'boxShell':
        this._shape = new BoxShape({
          boxX: this._boxSize.x,
          boxY: this._boxSize.y,
          boxZ: this._boxSize.z,
          emitFrom: 'shell',
        });
        break;
      case 'boxEdge':
        this._shape = new BoxShape({
          boxX: this._boxSize.x,
          boxY: this._boxSize.y,
          boxZ: this._boxSize.z,
          emitFrom: 'edge',
        });
        break;
      case 'sphere':
        this._shape = new SphereShape({
          radius: this._radius,
          emitFromShell: false,
        });
        break;
      case 'sphereShell':
        this._shape = new SphereShape({
          radius: this._radius,
          emitFromShell: true,
        });
        break;
      case 'hemisphere':
        this._shape = new HemisphereShape({
          radius: this._radius,
          emitFromShell: false,
        });
        break;
      case 'hemisphereShell':
        this._shape = new HemisphereShape({
          radius: this._radius,
          emitFromShell: true,
        });
        break;
      case 'circle':
        this._shape = new CircleShape({
          radius: this._radius,
          arc: this._arc,
          emitFromEdge: false,
        });
        break;
      case 'circleEdge':
        this._shape = new CircleShape({
          radius: this._radius,
          arc: this._arc,
          emitFromEdge: true,
        });
        break;
      case 'edge':
        this._shape = new EdgeShape({
          radius: this._radius,
        });
        break;
      case 'mesh':
        // TODO:
        break;
      default:
        console.warn(`emit shape ${this._shapeType} not support.`);
    }
  }
}

ParticleSystemComponent.schema = {
  material: {
    type: 'asset',
    default: null,
    set(val) {
      if (this._material === val) {
        return;
      }

      this._material = val;
      this._updateMaterialParams();
      this._updateModel();
    }
  },

  // main module properties
  capacity: {
    type: 'int',
    default: 2000,
  },

  startColorType: {
    type: 'enums',
    default: 'color',
    options: [
      'color',
      'gradient',
      'randomBetweenTwoColors',
      'randomBetweenTwoGradients',
      'randomColor'
    ],
  },

  startColor: {
    type: 'color4',
    default: [1, 1, 1, 1],
  },

  startColorMin: {
    type: 'color4',
    default: [1, 1, 1, 1],
  },

  startColorMax: {
    type: 'color4',
    default: [1, 1, 1, 1],
  },

  // TODO: color gradient.

  startSizeType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'randomBetweenTwoConstants',
      'randomBetweenTwoCurves'
    ],
  },

  startSize: {
    type: 'number',
    default: 1.0,
  },

  startSizeMin: {
    type: 'number',
    default: 1.0,
  },

  startSizeMax: {
    type: 'number',
    default: 1.0,
  },

  // TODO: startSize curve.

  startSpeedType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'randomBetweenTwoConstants',
      'randomBetweenTwoCurves'
    ],
  },

  startSpeed: {
    type: 'number',
    default: 5.0,
  },

  startSpeedMin: {
    type: 'number',
    default: 5.0,
  },

  startSpeedMax: {
    type: 'number',
    default: 5.0,
  },

  // TODO: startSpeed curve.

  startRotationType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'randomBetweenTwoConstants',
      'randomBetweenTwoCurves'
    ],
  },

  startRotation: {
    type: 'number',
    default: 0.0,
    set(val) {
      this._startRotation = toRadian(val);
    }
  },

  startRotationMin: {
    type: 'number',
    default: 0.0,
    set(val) {
      this._startRotationMin = toRadian(val);
    }
  },

  startRotationMax: {
    type: 'number',
    default: 0.0,
    set(val) {
      this._startRotationMax = toRadian(val);
    }
  },

  // TODO: startRotation curve.

  startDelayType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'randomBetweenTwoConstants'
    ],
  },

  startDelay: {
    type: 'number',
    default: 0.0,
  },

  startDelayMin: {
    type: 'number',
    default: 0.0,
  },

  startDelayMax: {
    type: 'number',
    default: 0.0,
  },

  startLifetimeType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'randomBetweenTwoConstants',
      'randowmBetweenTwoCurves'
    ],
  },

  startLifetime: {
    type: 'number',
    default: 5.0,
  },

  startLifetimeMin: {
    type: 'number',
    default: 5.0,
  },

  startLifetimeMax: {
    type: 'number',
    default: 5.0,
  },

  // TODO: startLifetime curve.

  // can only be set when not playing.
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
        this._material.define("USE_WORLD_SPACE", true);
      } else {
        this._material.define("USE_WORLD_SPACE", false);
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

  gravityModifierType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'randomBetweenTwoConstants',
      'randomBetweenTwoCurves'
    ],
  },

  gravityModifier: {
    type: 'number',
    default: 0.0,
  },

  gravityModifierMin: {
    type: 'number',
    default: 0.0,
  },

  gravityModifierMax: {
    type: 'number',
    default: 0.0,
  },

  // TODO: gravityModifier curve.


  // emission module
  rateOverTimeType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'randomBetweenTwoConstants',
      'randomBetweenTwoCurves'
    ],
  },

  rateOverTime: {
    type: 'number',
    default: 10.0,
  },

  rateOverTimeMin: {
    type: 'number',
    default: 10.0,
  },

  rateOverTimeMax: {
    type: 'number',
    default: 10.0,
  },

  // TODO: rateOverTime curve.

  rateOverDistanceType: {
    type: 'enums',
    default: 'constant',
    options: [
      'constant',
      'curve',
      'randomBetweenTwoConstants',
      'randomBetweenTwoCurves'
    ],
  },

  rateOverDistance: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (val > 0 && this._simulationSpace !== 'world') {
        console.warn('rateOverDistance only work in world simulation space.');
      }
      this._rateOverDistance = val;
    }
  },

  rateOverDistanceMin: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (val > 0 && this._simulationSpace !== 'world') {
        console.warn('rateOverDistance only work in world simulation space.');
      }
      this._rateOverDistanceMin = val;
    }
  },

  rateOverDistanceMax: {
    type: 'number',
    default: 0.0,
    set(val) {
      if (val > 0 && this._simulationSpace !== 'world') {
        console.warn('rateOverDistance only work in world simulation space.');
      }
      this._rateOverDistanceMax = val;
    }
  },

  // TODO: rateOverDistance curve.

  bursts: {
    type: 'object',
    default: [],
    array: true,
    set(val) {
      this._bursts = val;
      this._initBursts();
    }
  },


  // shape module
  shapeType: {
    type: 'enums',
    default: 'box',
    options: [
      'cone',
      'coneShell',
      'coneVolume',
      'box',
      'boxShell',
      'boxEdge',
      'sphere',
      'sphereShell',
      'hemisphere',
      'hemisphereShell',
      'circle',
      'circleEdge',
      'edge',
      'mesh',
    ],
    set(val) {
      if (this._shapeType === val) {
        return;
      }
      this._shapeType = val;
      this._updateShape();
    }
  },

  boxSize: {
    type: 'vec3',
    default: [1.0, 1.0, 1.0],
  },

  radius: {
    type: 'number',
    default: 1.0,
  },

  arc: {
    type: 'number',
    default: 2.0 * Math.PI,
    set(val) {
      this._arc = toRadian(val);
    }
  },

  alignToDirection: {
    type: 'boolean',
    default: false,
  },


  // render module
  renderMode: {
    type: 'enums',
    default: 'billboard',
    options: [
      'billboard',
      'stretchedBillboard',
      'horizontalBillboard',
      'verticalBillboard',
      'mesh', // TODO:
    ],
    set(val) {
      if (this._renderMode === val) {
        return;
      }
      this._renderMode = val;
      this._updateMaterialParams();
      this._updateModel();
    }
  },

  cameraScale: {
    type: 'number',
    default: 0.0,
  },

  velocityScale: {
    type: 'number',
    default: 1.0,
  },

  lengthScale: {
    type: 'number',
    default: 4.0,
  }

};