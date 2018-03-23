import { randomRange } from 'vmath';

export default class Burst {
  constructor() {
    this._remainingCount = 1;
    this._curTime = 0.0;
  }

  update(dt) {
    if (this._particleSystem._loop && this._remainingCount === 0) {
      this._remainingCount = this._repeatCount;
      this._curTime = this._time;
    }
    if (this._remainingCount > 0) {
      let preFrameTime = this._particleSystem._time - this._particleSystem._startDelay - dt;
      preFrameTime = (preFrameTime > 0.0) ? preFrameTime : 0.0;
      let curFrameTime = this._particleSystem.time - this._particleSystem._startDelay;
      if (this._curTime >= preFrameTime && this._curTime < curFrameTime) {
        this._particleSystem.emit(randomRange(this._minCount, this._maxCount));
        this._curTime += this._repeatInterval;
        --this._remainingCount;
      }
    }
  }
}

Burst.schema = {
  particleSystem: {
    type: 'component',
    default: null,
    set(val) {
      this._particleSystem = val;
    }
  },

  time: {
    type: 'number',
    default: 0.0,
    set(val) {
      this._time = val;
      this._curTime = val;
    }
  },

  minCount: {
    type: 'int',
    default: 30,
    set(val) {
      this._minCount = val;
    }
  },

  maxCount: {
    type: 'int',
    default: 30,
    set(val) {
      this._maxCount = val;
    }
  },

  repeatCount: {
    type: 'number',
    default: 1,
    set(val) {
      this._repeatCount = val;
      this._remainingCount = val;
    }
  },

  repeatInterval: {
    type: 'number',
    default: 1.0,
    set(val) {
      this._repeatInterval = val;
    }
  }
};