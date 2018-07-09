import { repeat, lerp } from "../../../vmath";


export default class TextureAnimationModule {

  animate(p) {
    let normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
    let startFrame = this._startFrame.evaluate(normalizedTime, p.randomSeed) / (this._numTilesX * this._numTilesY);
    if (this._animation == 'wholeSheet') {
      p.frameIndex = repeat(this._cycleCount * (this._frameOverTime.evaluate(normalizedTime, p.randomSeed) + startFrame), 1);
    }
    else if (this._animation == 'singleRow') {
      let rowLength = 1 / this._numTilesY;
      if (this._randomRow) {
        let f = repeat(this._cycleCount * (this._frameOverTime.evaluate(normalizedTime, p.randomSeed) + startFrame), 1);
        let startRow = Math.floor(Math.random() * this._numTilesY);
        let from = startRow * rowLength;
        let to = from + rowLength;
        p.frameIndex = lerp(from, to, f);
      }
      else {
        let from = this._rowIndex * rowLength;
        let to = from + rowLength;
        p.frameIndex = lerp(from, to, repeat(this._cycleCount * (this._frameOverTime.evaluate(normalizedTime, p.randomSeed) + startFrame), 1));
      }
    }
  }
}

TextureAnimationModule.schema = {

  enable: {
    type: 'boolean',
    default: false
  },

  mode: {
    type: 'enums',
    options: [
      'grid',
      'sprites'
    ],
    default: 'grid',
    set(val) {
      if (val === 'sprites') {
        console.error("particle texture animation's sprites is not supported!");
        return;
      }
    }
  },

  numTilesX: {
    type: 'number',
    default: 0
  },

  numTilesY: {
    type: 'number',
    default: 0
  },

  animation: {
    type: 'enums',
    options: [
      'wholeSheet',
      'singleRow'
    ],
    default: 'wholeSheet'
  },

  frameOverTime: {
    type: 'CurveRange',
    default: null
  },

  startFrame: {
    type: 'CurveRange',
    default: null
  },

  cycleCount: {
    type: 'number',
    default: 0
  },

  flipU: {
    type: 'number',
    default: 0,
    set(val) {
      console.error("particle texture animation's flipU is not supported!");
    }
  },

  flipV: {
    type: 'number',
    default: 0,
    set(val) {
      console.error("particle texture animation's flipV is not supported!");
    }
  },

  uvChannelMask: {
    type: 'number',
    default: -1,
    set(val) {
      console.error("particle texture animation's uvChannelMask is not supported!");
    }
  },

  randomRow: {
    type: 'boolean',
    default: false
  },

  rowIndex: {
    type: 'number',
    default: 0
  }
};