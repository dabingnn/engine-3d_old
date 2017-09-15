import { vec3, quat, clamp } from 'vmath';
import Asset from './asset';

function _binaryIndexOf(array, key) {
  let lo = 0;
  let hi = array.length - 1;
  let mid;

  while (lo <= hi) {
    mid = ((lo + hi) >> 1);
    let val = array[mid];

    if (val < key) {
      lo = mid + 1;
    } else if (val > key) {
      hi = mid - 1;
    } else {
      return mid;
    }
  }

  return lo;
}

export default class AnimationClip extends Asset {
  constructor() {
    super();

    /**
     * framesList: [{
     *   name: '',
     *   times: [0.0, ...],
     *   jionts: [{ id: -1, translations: [], rotations: [], scales: [] }, ...],
     * }, ...]
     */
    this._framesList = null;
    this._length = 0.0;

    // TODO:
    // this._events = []
  }

  get length() {
    return this._length;
  }

  sample(skeleton, t) {
    clamp(t, 0, this._length);

    for (let i = 0; i < this._framesList.length; ++i) {
      let frames = this._framesList[i];

      if (frames.times.length === 1) {
        for (let j = 0; j < frames.joints.length; ++j) {
          let jointFrames = frames.joints[j];
          let joint = skeleton._joints[jointFrames.id];

          if (jointFrames.translations) {
            vec3.copy(joint.lpos, jointFrames.translations[0]);
          }

          if (jointFrames.rotations) {
            quat.copy(joint.lrot, jointFrames.rotations[0]);
          }

          if (jointFrames.scales) {
            vec3.copy(joint.lscale, jointFrames.scales[0]);
          }
        }
      } else {
        let idx = _binaryIndexOf(frames.times, t);
        if (idx === 0) {
          for (let j = 0; j < frames.joints.length; ++j) {
            let jointFrames = frames.joints[j];
            let joint = skeleton._joints[jointFrames.id];

            if (jointFrames.translations) {
              vec3.copy(joint.lpos, jointFrames.translations[0]);
            }

            if (jointFrames.rotations) {
              quat.copy(joint.lrot, jointFrames.rotations[0]);
            }

            if (jointFrames.scales) {
              vec3.copy(joint.lscale, jointFrames.scales[0]);
            }
          }

          return;
        }

        let loIdx = Math.max(idx - 1, 0);
        let hiIdx = Math.min(idx, frames.times.length);
        let ratio = (t - frames.times[loIdx]) / (frames.times[hiIdx] - frames.times[loIdx]);

        for (let j = 0; j < frames.joints.length; ++j) {
          let jointFrames = frames.joints[j];
          let joint = skeleton._joints[jointFrames.id];

          if (jointFrames.translations) {
            let a = jointFrames.translations[loIdx];
            let b = jointFrames.translations[hiIdx];

            vec3.lerp(joint.lpos, a, b, ratio);
          }

          if (jointFrames.rotations) {
            let a = jointFrames.rotations[loIdx];
            let b = jointFrames.rotations[hiIdx];

            quat.slerp(joint.lrot, a, b, ratio);
          }

          if (jointFrames.scales) {
            let a = jointFrames.scales[loIdx];
            let b = jointFrames.scales[hiIdx];

            vec3.lerp(joint.lscale, a, b, ratio);
          }
        }
      }
    }

    skeleton.updateMatrices();
  }
}