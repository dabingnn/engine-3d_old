import registry from "../../lib/misc/registry";

export class Keyframe {
  
}

Keyframe.schema = {
  time: {
    type: 'number',
    default: 0,
  },
  value: {
    type: 'number',
    default: 0,
  },
  inTangent: {
    type: 'number',
    default: 0,
  },
  outTangent: {
    type: 'number',
    default: 0,
  }
}

export class AnimationCurve {
  constructor(keyFrames) {
    this._keyFrames = keyFrames;
  }

  addKey(keyFrame) {
    if (this._keyFrames === null)
      this._keyFrames = [];
    this._keyFrames.push(keyFrame);
  }

  //cubic Hermite spline
  evaluate(time) {
    let localTime = time;
    let wrapMode = time < 0 ? this._preWrapMode : this._postWrapMode;
    let lastTime = this._keyFrames[this._keyFrames.length - 1].time;
    switch (wrapMode) {
      case 'loop':
        localTime = time - Math.trunc(time / lastTime) * lastTime;
        if (localTime < 0)
          localTime += lastTime;
        break;
      case 'pingPong':
        let posTime = Math.abs(time);
        let turns = Math.trunc(posTime / lastTime);
        localTime = turns % 2 ? ((1 + turns) * lastTime - posTime) : (posTime - turns * lastTime);
        break;
      case 'clampForever':
        if (time < 0)
          localTime = 0;
        else if (time > lastTime)
          localTime = lastTime;
    }
    let preKFIndex = 0;
    if (localTime > this._keyFrames[0].time) {
      if (localTime >= this._keyFrames[this._keyFrames.length - 1].time)
        preKFIndex = this._keyFrames.length - 2;
      else {
        for (let i = 0; i < this._keyFrames.length - 1; i++) {
          if (localTime >= this._keyFrames[0].time && localTime <= this._keyFrames[i + 1].time) {
            preKFIndex = i;
            break;
          }
        }
      }
    }
    let keyframe0 = this._keyFrames[preKFIndex];
    let keyframe1 = this._keyFrames[preKFIndex + 1];

    let t = AnimationCurve.inverseLerp(keyframe0.time, keyframe1.time, localTime);
    let dt = keyframe1.time - keyframe0.time;

    let m0 = keyframe0.outTangent * dt;
    let m1 = keyframe1.inTangent * dt;

    let t2 = t * t;
    let t3 = t2 * t;

    let a = 2 * t3 - 3 * t2 + 1;
    let b = t3 - 2 * t2 + t;
    let c = t3 - t2;
    let d = -2 * t3 + 3 * t2;

    return a * keyframe0.value + b * m0 + c * m1 + d * keyframe1.value;
  }

  static inverseLerp(a, b, value) {
    return (value - a) / (b - a);
  }
}

AnimationCurve.schema = {
  keyFrames: {
    type: 'Keyframe',
    default: null,
    array: true,
  },
  preWrapMode: {
    type: 'enums',
    default: 'default',
    options: [
      'default',
      'once',
      'loop',
      'pingPong',
      'clampForever'
    ],
  },
  postWrapMode: {
    type: 'enums',
    default: 'default',
    options: [
      'default',
      'once',
      'loop',
      'pingPong',
      'clampForever'
    ],
  }
}
