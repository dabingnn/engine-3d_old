// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { Component } from 'ecs.js';
import renderer from 'renderer.js';
import Material from '../../assets/material';
import gfx from 'gfx.js';
import { RecyclePool } from 'memop';
import Particle from './particle';
import { color3, vec3, randomRange, color4, vec2 } from 'vmath';

let _name2VertAttrs = {
  'Position': { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
  'UV': { name: gfx.ATTR_UV, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
  'Color': { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_FLOAT32, num: 4 },
  'Normal': { name: gfx.ATTR_NORMAL, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
  'Tangent': { name: gfx.ATTR_TANGENT, type: gfx.ATTR_TYPE_FLOAT32, num: 3 },
  'Custom1': {name: gfx.ATTR_UV1, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
  'Custom2': {name: gfx.ATTR_UV2, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
};

let _vertAttrsCache = {
 position: vec3.create(),
 uv: vec2.create(),
 color: color4.create(),
 normal: vec3.create(),
 tangent: vec3.create(),
 custom1: vec2.create(),
 custom2: vec2.create(),
};

export default class ParticleSystemComponent extends Component {
  constructor() {
    super();

    // this._material = null;
    this._model = null;

    // internal status
    this._isPlaying = false;
    this._isPaused = false;
    this._isStopped = true;
    this._isEmitting = false; // ?

    this._time = 0.0;  // playback position in seconds.
    this._emitRateCounter = 0.0;

    this._vertAttrs = [];

  }

  onInit() {
    this._particles = new RecyclePool(() => {
      return new Particle();
    }, this._capacity);
    this._model = new renderer.ParticleBatchModel(this._app.device, this._capacity);
    this._model.setNode(this._entity);
    // HACK, TODO
    if (this._material === null) {
      this._material = new Material();
      this._material.effect = this._app.assets.get('builtin-effect-particle-premultiply-blend');
    }

    this._system.add(this);
  }

  onDestroy() {
    this._system.remove(this);
  }

  onEnable() {
    this._app.scene.addModel(this._model);
  }

  onDisable() {
    this._app.scene.removeModel(this._model);
  }

  set material(val) {
    this._material = val;
    this._model.setEffect(val.effectInst);
  }

  setVertexAtrributes(attrs) {
    for (let i = 0; i < attrs.length; ++i) {
      let attr = _name2VertAttrs(attrs[i]);
      if (attr !== undefined) {
        this._vertAttrs.push(attr);
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
      // this._app.scene.addModel(this._model);
      this._isStopped = false;
    }

    this._isPlaying = true;
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
    this._emitRateCounter = 0.0;
    // this._app.scene.removeModel(this._model);

    this._isStopped = true;
  }

  // remove all particles from current particle system.
  clear() {
    this._particles.reset();
  }

  emit(count, emitParams = null) {
    if (!this._isEmitting) {
      return;
    }
    if (emitParams !== null) {
      // TODO:
    }
    for (let i = 0; i < count; ++i) {
      if (this._particles.length >= this._capacity) {
        return;
      }

      let particle = this._particles.add();
      // TODO:
      particle.position = vec3.new(0, 0, 0);
      particle.velocity = vec3.new(randomRange(-5, 5), randomRange(-5, 5), randomRange(-5, 5));
      particle.startSize = vec3.new(randomRange(1, 5), randomRange(1, 5), randomRange(1, 5));
      particle.startColor = color4.new(1, 1, 1, 1);
      particle.remainingLifetime = 5.0;
    }
  }

  // simulation, update particles.
  _update(dt) {
    for (let i = 0; i < this._particles.length; ++i) {
      let p = this._particles.data[i];
      p.remainingLifetime -= dt;

      if(p.remainingLifetime < 0.0) {
        this._particles.remove(i);
        --i;
        continue;
      }

      vec3.scaleAndAdd(p.position, p.position, p.velocity, dt);
    }
  }

  tick(dt) {
    // if (this._isStopped || this._isPaused) {
    //   return;
    // }

    if (this._isPlaying) {
      this._time += dt;

      // emit particles.
      if (this._time > this._startDelay) {
        this._isEmitting = true;
        if (this._time > this._duration) {
          this._emitRateCounter = 0.0;
          if (!this._loop) {
            this._isEmitting = false;
          }
        }
        this._emitRateCounter += this._rateOverTime * dt;
        if (this._emitRateCounter > 1) {
          let emitNum = Math.floor(this._emitRateCounter);
          this._emitRateCounter -= emitNum;
          this.emit(emitNum);
        }
      }

      // simulation, update particles.
      this._update(dt);

      // update vertex buffer
      let idx = 0;
      for (let i = 0; i < this._particles.length; ++i) {
        // TODO: set pvdata according to user custom vertex attributes.
        let p = this._particles.data[i];
        this._model.addParticleVertexData(
          idx++,
          [
            vec3.set(_vertAttrsCache.position, p.position.x - p.startSize.x/2, p.position.y - p.startSize.x/2, p.position.z),
            vec2.set(_vertAttrsCache.uv, 0, 0),
            color4.set(_vertAttrsCache.color, p.startColor.r, p.startColor.g, p.startColor.b, p.startColor.a)
          ]
        );
        this._model.addParticleVertexData(
          idx++,
          [
            vec3.set(_vertAttrsCache.position, p.position.x + p.startSize.x/2, p.position.y - p.startSize.x/2, p.position.z),
            vec2.set(_vertAttrsCache.uv, 1, 0),
            color4.set(_vertAttrsCache.color, p.startColor.r, p.startColor.g, p.startColor.b, p.startColor.a)
          ]
        );
        this._model.addParticleVertexData(
          idx++,
          [
            vec3.set(_vertAttrsCache.position, p.position.x - p.startSize.x/2, p.position.y + p.startSize.x/2, p.position.z),
            vec2.set(_vertAttrsCache.uv, 0, 1),
            color4.set(_vertAttrsCache.color, p.startColor.r, p.startColor.g, p.startColor.b, p.startColor.a)
          ]
        );
        this._model.addParticleVertexData(
          idx++,
          [
            vec3.set(_vertAttrsCache.position, p.position.x + p.startSize.x/2, p.position.y + p.startSize.x/2, p.position.z),
            vec2.set(_vertAttrsCache.uv, 1, 1),
            color4.set(_vertAttrsCache.color, p.startColor.r, p.startColor.g, p.startColor.b, p.startColor.a)
          ]
        );
      }

      this._model.updateIA(this._particles.length * 4);
    }
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
  material: {
    type: 'asset',
    default: null,
    set(val) {
      if (this._material === val) {
        return;
      }

      this._material = val;
      this._model.setEffect(val.effectInst);
    }
  },

  // main module properties
  capacity: {
    type: 'number',
    default: 2000,
  },

  startColor: {
    type: 'color3',
    default: [1, 1, 1],
    set(val) {
      this._startColor = val;
    }
  },

  startSize: {
    type: 'number',
    default: 1,
    set(val) {
      this._startSize = val;
    }
  },

  startSpeed: {
    type: 'number',
    default: 5,
    set(val) {
      this._startSpeed = val;
    }
  },

  startRotation: {
    type: 'number',
    default: 0,
    set(val) {
      this._startRotation = val;
    }
  },

  startDelay: {
    type: 'number',
    default: 0,
    set(val) {
      this._startDelay = val;
    }
  },

  startLifetime: {
    type: 'number',
    default: 5,
    set(val) {
      this._startLifetime = val;
    }
  },

  // can be set when not playing
  duration: {
    type: 'number',
    default: 5,
    set(val) {
      this._duration = val;
    }
  },

  loop: {
    type: 'boolean',
    default: true,
    set(val) {
      this._loop = val;
    }
  },

  // emission module
  rateOverTime: { // TODO: constant, curve, random between two constants, random between two curves
    type: 'number',
    default: 50,
    set(val) {
      this._rateOverTime = val;
    }
  },

  rateOverDistance: {
    type: 'number',
    default: 10,
    set(val) {
      this._rateOverDistance = val;
    }
  },

  // shape module
  shapeType: {
    type: 'enums',
    default: 'cone',
    options: [
      'cone',
      'box',
      'sphere',
      'hemisphere',
      'circle',
      'mesh',
    ],
    set(val) {
      if (this._shapeType === val) {
        return;
      }

      this._shapeType = val;
    }
  },

};