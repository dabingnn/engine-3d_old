import { color3, color4 } from '../../../vmath';

export class ColorKey {

}

ColorKey.schema = {
  color: {
    type: 'color3',
    default: [1, 1, 1],
  },

  time: {
    type: 'number',
    default: 0.0,
  }
};

export class AlphaKey {

}

AlphaKey.schema = {
  alpha: {
    type: 'number',
    default: 1.0,
  },

  time: {
    type: 'number',
    default: 0.0,
  }
};

export default class Gradient {
  constructor() {
    this._rgb = color3.new(1, 1, 1);
    this._rgba = color4.new(1, 1, 1, 1);
  }

  setKeys(colorKeys, alphaKeys) {
    this._colorKeys = colorKeys;
    this._alphaKeys = alphaKeys;
  }

  sortKeys() {
    if (this._colorKeys.length > 1) {
      this._colorKeys.sort((a, b) => a.time - b.time);
    }
    if (this._alphaKeys.length > 1) {
      this._alphaKeys.sort((a, b) => a.time - b.time);
    }
  }

  getRGB(time) {
    if (this._colorKeys.length > 1) {
      if (time <= this._colorKeys[0].time) {
        return this._colorKeys[0].color;
      }
      if (time >= this._colorKeys[this._colorKeys.length - 1].time) {
        return this._colorKeys[this._colorKeys.length - 1].color;
      }
      for (let i = 1; i < this._colorKeys.length; ++i) {
        let preTime = this._colorKeys[i - 1].time;
        let curTime = this._colorKeys[i].time;
        if (time >= preTime && time < curTime) {
          if(this._mode === 'fixed') {
            return this._colorKeys[i].color;
          }
          let factor = (time - preTime) / (curTime - preTime);
          color3.lerp(this._rgb, this._colorKeys[i - 1].color, this._colorKeys[i].color, factor);
          return this._rgb;
        }
      }
      console.warn('something went wrong. can not get gradient color.');
    } else if (this._colorKeys.length === 1) {
      return this._colorKeys[0].color;
    } else {
      return color3.set(this._rgb, 1, 1, 1);
    }
  }

  getAlpha(time) {
    if (this._alphaKeys.length > 1) {
      if (time <= this._alphaKeys[0].time) {
        return this._alphaKeys[0].alpha;
      }
      if (time >= this._alphaKeys[this._alphaKeys.length - 1].time) {
        return this._alphaKeys[this._alphaKeys.length - 1].alpha;
      }
      for (let i = 1; i < this._alphaKeys.length; ++i) {
        let preTime = this._alphaKeys[i - 1].time;
        let curTime = this._alphaKeys[i].time;
        if (time >= preTime && time < curTime) {
          if(this._mode === 'fixed') {
            return this._alphaKeys[i].alpha;
          }
          let factor = (time - preTime) / (curTime - preTime);
          return (this._alphaKeys[i - 1].alpha * (1 - factor) + this._alphaKeys[i].alpha * factor);
        }
      }
      console.warn('something went wrong. can not get gradient alpha.');
    } else if (this._alphaKeys.length === 1) {
      return this._alphaKeys[0].alpha;
    } else {
      return 1.0;
    }
  }

  evaluate(time) {
    let rgb = this.getRGB(time);
    color4.set(this._rgba, rgb.r, rgb.g, rgb.b, this.getAlpha(time));
    return this._rgba;
  }

  randomColor() {
    let c = this._colorKeys[Math.trunc(Math.random() * this._colorKeys.length)];
    let a = this._alphaKeys[Math.trunc(Math.random() * this._alphaKeys.length)];
    color4.set(this._rgba, c.r, c.g, c.b, a);
    return this._rgba;
  }
}

Gradient.schema = {
  colorKeys: {
    type: 'ColorKey',
    default: [],
    array: true,
  },

  alphaKeys: {
    type: 'AlphaKey',
    default: [],
    array: true,
  },

  mode: {
    type: 'enums',
    default: 'blend',
    options: [
      'blend',
      'fixed'
    ]
  }
};
