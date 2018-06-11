import { clamp } from '../vmath';

// TODO: move Timeline to Assets, add Timeline Component

export default class Timeline {
  constructor(engine, opts) {
    this._engine = engine;

    // callbacks
    this.update = opts.update;
    this.start = opts.start;
    this.run = opts.run;
    this.end = opts.end;

    this._tracks = [];

    // TODO: move to schema(loopNum, direction, duration)
    this._loopNum = 1;
    if (opts.loopNum !== undefined) {
      this._loopNum = opts.loopNum;
    }
    this._direction = 'normal';
    if (opts.direction !== undefined) {
      this._direction = opts.direction;
    }
    this._duration = 1;
    if (opts.duration !== undefined) {
      this._duration = opts.duration;
    }

    this._paused = true;
    this._began = false;
    this._completed = false;
    this._reversed = false;

    this._currentTime = 0;
    this._remaining = 0;
    this._now = 0;
    this._startTime = 0;
    this._lastTime = 0;

    // children
    this._children = [];

    this.reset();
  }

  _adjustTime(time) {
    return this._reversed ? this._duration - time : time;
  }

  toggle() {
    this._reversed = !this._reversed;
  }

  _invokeCallback(cb) {
    if (this[cb]) {
      this[cb](this);
    }
  }

  addChild(child) {
    if (this._duration <= child._duration) {
      this._duration = child._duration;
    }
    this.pause();
    child.pause();
    child._began = true;
    child._completed = true;
    child._direction = this._direction;

    this._children.push(child);
  }

  addTracks(tracks) {
    for (let i = 0; i < tracks.length; ++i) {
      this._tracks.push(tracks[i]);
      // update timeline's duration
      if (tracks[i].duration > this._duration) {
        this._duration = tracks[i].duration;
      }
    }
  }

  _syncChildren(time) {
    let children = this._children;
    let childrenLength = children.length;

    if (time >= this._currentTime) {
      for (let i = 0; i < childrenLength; ++i) {
        children[i]._setProgress(time);
      }
    } else {
      for (let i = childrenLength - 1; i >= 0; --i) {
        children[i]._setProgress(time);
      }
    }
  }

  _setTracksProgress(time) {
    for (let i = 0; i < this._tracks.length; ++i) {
      const track = this._tracks[i];
      for (let j = 0; j < track.clips.length; ++j) {
        const clip = track.clips[j];
        if (clip.startTime <= time && clip.endTime >= time) {
          const elapsed = clamp(time - clip.startTime - clip.delay, 0, clip.duration) / clip.duration;
          const eased = isNaN(elapsed) ? 1 : clip.easing(elapsed);

          track.target[track.property] = track.lerp(clip.from, clip.to, eased);

          break;
        } else if (clip.startTime > time) {
          track.target[track.property] = track.lerp(clip.from, clip.to, 0);
        } else if (clip.endTime < time) {
          track.target[track.property] = track.lerp(clip.from, clip.to, 1);
        }
      }
    }
    this._currentTime = time;
  }

  _decreaseRemaining() {
    if (this._remaining > 0) {
      --this._remaining;
    }
  }

  _setProgress(t) {
    const duration = this._duration;
    const time = this._adjustTime(t);
    if (this._children.length > 0) {
      this._syncChildren(time);
    }

    // if (time >= 0 || !duration) { // why ?
    if (time >= 0) {
      if (!this._began) {
        this._began = true;
        this._invokeCallback('start');
      }
      this._invokeCallback('run');
    }

    if (time > 0 && time < duration) {
      this._setTracksProgress(time);
    } else {
      if (time <= 0 && this._currentTime !== 0) {
        this._setTracksProgress(0);
        if (this._reversed) {
          this._decreaseRemaining();
        }
      }
      // if ((time >= duration && this._currentTime !== duration) || !duration) { // why ?
      if (time >= duration && this._currentTime !== duration) {
        this._setTracksProgress(duration);
        if (!this._reversed) {
          this._decreaseRemaining();
        }
      }
    }

    this._invokeCallback('update');

    if (t >= duration) {
      if (this._remaining > 0) {
        this._startTime = this._now;
        if (this._direction === 'alternate') {
          this.toggle();
        }
      } else {
        this.pause();
        if (!this._completed) {
          this._completed = true;
          this._invokeCallback('end');
        }
      }
      this._lastTime = 0;
    }
  }

  tick(t) {
    this._now = t;
    if (this._startTime === 0) {
      this._startTime = this._now;
    }
    let _t = this._lastTime + this._now - this._startTime;
    this._setProgress(_t);
  }

  pause() {
    this._engine._remove(this);
    this._paused = true;
  }

  play() {
    if (!this._paused) {
      return;
    }
    this._paused = false;
    this._startTime = 0;
    this._lastTime = this._adjustTime(this._currentTime);

    this._engine._add(this);
  }

  reverse() {
    this.toggle();
    this._startTime = 0;
    this._lastTime = this._adjustTime(this._currentTime);
  }

  restart() {
    this.pause();
    this.reset();
    this.play();
  }

  reset() {
    this._currentTime = 0;
    this._paused = true;
    this._began = false;
    this._completed = false;
    this._reversed = this._direction === 'reverse';
    this._remaining = (this._direction === 'alternate' && this._loopNum === 1) ? 2 : this._loopNum;
    this._setTracksProgress(0);
    for (let i = this._children.length - 1; i >= 0; --i) {
      this._children[i].reset();
    }
  }
}

// Timeline.schema = {
//   loopNum: {
//     type: 'int',
//     default: 1,
//     set(val) {
//       console.log(`loop num val = ${val}`);
//       this._loopNum = val;
//     }
//   },

//   direction: {
//     type: 'enums',
//     default: 'normal',
//     options: [
//       'normal',
//       'reverse',
//       'alternate',
//     ],
//   },

//   duration: {
//     type: 'number',
//     default: 1.0,
//   },
// };