import { repeat, pingPong, inverseLerp } from "../vmath";

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
    let wrappedTime = time;
    let wrapMode = time < 0 ? this._preWrapMode : this._postWrapMode;
    let startTime = this._keyFrames[0].time;
    let endTime = this._keyFrames[this._keyFrames.length - 1].time;
    switch (wrapMode) {
      case 'loop':
        wrappedTime = repeat(time - startTime, endTime - startTime) + startTime;
        break;
      case 'pingPong':
        wrappedTime = pingPong(time - startTime, endTime - startTime) + startTime;
        break;
      case 'clampForever':
        if (time < startTime)
          wrappedTime = startTime;
        else if (time > endTime)
          wrappedTime = endTime;
    }
    let preKFIndex = 0;
    if (wrappedTime > this._keyFrames[0].time) {
      if (wrappedTime >= this._keyFrames[this._keyFrames.length - 1].time)
        preKFIndex = this._keyFrames.length - 2;
      else {
        for (let i = 0; i < this._keyFrames.length - 1; i++) {
          if (wrappedTime >= this._keyFrames[0].time && wrappedTime <= this._keyFrames[i + 1].time) {
            preKFIndex = i;
            break;
          }
        }
      }
    }
    let keyframe0 = this._keyFrames[preKFIndex];
    let keyframe1 = this._keyFrames[preKFIndex + 1];

    let t = inverseLerp(keyframe0.time, keyframe1.time, wrappedTime);
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
