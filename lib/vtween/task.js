import { vec2, vec3, vec4, color3, color4, quat, clamp } from '../vmath';

let _vec2 = vec2.create();
let _vec3 = vec3.create();
let _vec4 = vec4.create();
let _color3 = color3.create();
let _color4 = color4.create();
let _quat = quat.create();

function getCloneFromType(type, value) {
  if (type === 'number') {
    return value;
  } else if (type === 'vec2') {
    return vec2.clone(value);
  } else if (type === 'vec3') {
    return vec3.clone(value);
  } else if (type === 'vec4') {
    return vec4.clone(value);
  } else if (type === 'color3') {
    return color3.clone(value);
  } else if (type === 'color4') {
    return color4.clone(value);
  } else if (type === 'quat') {
    return quat.clone(value);
  }

  return value;
}

function parseValue(type, value) {
  let ret;

  if (type === 'number') {
    return value;
  } else if (type === 'vec2') {
    ret = vec2.create();
    vec2.set(ret, value[0], value[1]);
    return ret;
  } else if (type === 'vec3') {
    ret = vec3.create();
    vec3.set(ret, value[0], value[1], value[2]);
    return ret;
  } else if (type === 'vec4') {
    ret = vec4.create();
    vec4.set(ret, value[0], value[1], value[2], value[3]);
    return ret;
  } else if (type === 'color3') {
    ret = color3.create();
    color3.set(ret, value[0], value[1], value[2]);
    return ret;
  } else if (type === 'color4') {
    ret = color4.create();
    color4.set(ret, value[0], value[1], value[2], value[3]);
    return ret;
  } else if (type === 'quat') {
    ret = quat.create();
    quat.set(ret, value[0], value[1], value[2], value[3]);
    return ret;
  }

  return null;
}

function getLerpFunc(type) {
  if (type === 'number') {
    return (from, to, t) => { let out = ((to - from) * t) + from; return out; };
  } else if (type === 'vec2') {
    return (from, to, t) => { return vec2.lerp(_vec2, from, to, t); };
  } else if (type === 'vec3') {
    return (from, to, t) => { return vec3.lerp(_vec3, from, to, t); };
  } else if (type === 'vec4') {
    return (from, to, t) => { return vec4.lerp(_vec4, from, to, t); };
  } else if (type === 'color3') {
    return (from, to, t) => { return color3.lerp(_color3, from, to, t); };
  } else if (type === 'color4') {
    return (from, to, t) => { return color4.lerp(_color4, from, to, t); };
  } else if (type === 'quat') {
    return (from, to, t) => { return quat.lerp(_quat, from, to, t); };
  }
}

function findMaxDuration(tracks) {
  let maxDuration = 0;
  for (let i = 0; i < tracks.length; ++i) {
    if (tracks[i].duration >= maxDuration) {
      maxDuration = tracks[i].duration;
    }
  }
  return maxDuration;
}

function _createTweens(targetProperty, tweensProp, tweenType, opts) {
  let tweens = [];
  let prevTween;

  if (Array.isArray(tweensProp) === false) {
    tweensProp = [tweensProp];
  }

  for (let i = 0; i < tweensProp.length; ++i) {
    let tweenProp = tweensProp[i];

    let duration = tweensProp[i].duration;
    if (duration === undefined) {
      duration = opts.duration;
    }

    let delay = tweenProp.delay;
    if (delay === undefined) {
      delay = opts.delay;
    }

    let easing = tweenProp.easing;
    if (easing === undefined) {
      easing = opts.easing;
    }

    let elasticity = tweenProp.elasticity;
    if (elasticity === undefined) {
      elasticity = opts.elasticity;
    }

    let to;
    let from;

    if (tweenProp.value[0] instanceof Array === true) {
      from = parseValue(tweenType, tweenProp.value[0]);
      to = parseValue(tweenType, tweenProp.value[1]);
    } else {
      from = getCloneFromType(tweenType, targetProperty);
      to = parseValue(tweenType, tweenProp.value);
    }

    let startTime = prevTween ? prevTween.endTime : 0;

    let tween = {
      duration: duration,
      delay: delay,
      easing: easing,
      elasticity: elasticity,
      startTime: startTime,
      endTime: startTime + duration + delay,
      to: to,
      from: prevTween ? prevTween.to : from,
    };

    prevTween = tween;
    tweens.push(tween);
  }

  return tweens;
}

function _createTracks(targets, props, opts) {
  let tracks = [];

  if (targets instanceof Array) {
    for (let i = 0; i < targets.length; ++i) {
      let target = targets[i];

      for (let name in props) {
        let propInfo = props[name];

        let tweens = _createTweens(target[name], propInfo.tweens, propInfo.type, opts);

        let type = propInfo.type;

        tracks.push({
          target: target,
          property: name,
          type: type,
          tweens: tweens,
          duration: tweens[tweens.length - 1].endTime,
          delay: tweens[0].delay,
          lerp: getLerpFunc(type),
        });
      }
    }
  }

  return tracks;
}

export default class Task {
  constructor(engine, targets, props, opts) {
    this._engine = engine;

    // animation options
    this.loop = 1;
    if (opts.loop !== undefined) {
      this.loop = opts.loop;
    }

    this.direction = 'normal';
    if (opts.direction !== undefined) {
      this.direction = opts.direction;
    }

    this.autoplay = true;
    if (opts.autoplay !== undefined) {
      this.autoplay = opts.autoplay;
    }

    this.duration = 1000;
    if (opts.duration !== undefined) {
      this.duration = opts.duration;
    }

    // callbacks
    this.update = opts.update;
    this.start = opts.start;
    this.run = opts.run;
    this.end = opts.end;

    // create animations
    this.tracks = _createTracks(targets, props, opts);
    this.duration = findMaxDuration(this.tracks);

    this.paused = true;
    this.began = false;
    this.completed = false;
    this.reversed = false;

    this.currentTime = 0;
    this.remaining = 0;
    this.now = 0;
    this.startTime = 0;
    this.lastTime = 0;

    // children
    this.children = [];

    this.reset();

    if (this.autoplay) {
      this.play();
    }
  }

  adjustTime(time) {
    return this.reversed ? this.duration - time : time;
  }

  toggle() {
    this.reversed = !this.reversed;
  }

  countIteration() {
    if (this.remaining && this.remaining !== true) {
      this.remaining--;
    }
  }

  invokeCallback(cb) {
    if (this[cb]) {
      this[cb](this);
    }
  }

  syncChildren(time) {
    let children = this.children;
    let childrenLength = children.length;

    if (time >= this.currentTime) {
      for (let i = 0; i < childrenLength; ++i) {
        children[i].seek(time);
      }
    } else {
      for (let i = childrenLength - 1; i >= 0; --i) {
        children[i].seek(time);
      }
    }
  }

  _setTracksProgress(time) {
    for (let i = 0; i < this.tracks.length; i++) {
      const track = this.tracks[i];
      for (let j = 0; j < track.tweens.length; j++) {
        const tween = track.tweens[j];
        if (tween.startTime <= time && tween.endTime >= time) {
          const elapsed = clamp(time - tween.startTime - tween.delay, 0, tween.duration) / tween.duration;
          const eased = isNaN(elapsed) ? 1 : tween.easing(elapsed);

          track.target[track.property] = track.lerp(tween.from, tween.to, eased);

          break;
        } else if (tween.startTime > time) {
          track.target[track.property] = track.lerp(tween.from, tween.to, 0);
        } else if (tween.endTime < time) {
          track.target[track.property] = track.lerp(tween.from, tween.to, 1);
        }
      }
    }
    this.currentTime = time;
  }

  _setProgress(t) {
    const duration = this.duration;
    const time = this.adjustTime(t);
    if (this.children.length > 0) {
      this.syncChildren(time);
    }

    if (time >= 0 || !duration) {
      if (!this.began) {
        this.began = true;
        this.invokeCallback('start');
      }
      this.invokeCallback('run');
    }

    if (time > 0 && time < duration) {
      this._setTracksProgress(time);
    } else {
      if (time <= 0 && this.currentTime !== 0) {
        this._setTracksProgress(0);
        if (this.reversed) {
          this.countIteration();
        }
      }
      if ((time >= duration && this.currentTime !== duration) || !duration) {
        this._setTracksProgress(duration);
        if (!this.reversed) {
          this.countIteration();
        }
      }
    }

    this.invokeCallback('update');

    if (t >= duration) {
      if (this.remaining) {
        this.startTime = this.now;
        if (this.direction === 'alternate') {
          this.toggle();
        }
      } else {
        this.pause();
        if (!this.completed) {
          this.completed = true;
          this.invokeCallback('end');
        }
      }
      this.lastTime = 0;
    }
  }

  tick(t) {
    this.now = t;
    if (!this.startTime) {
      this.startTime = this.now;
    }
    let _t = this.lastTime + this.now - this.startTime;
    this._setProgress(_t);
  }

  seek(time) {
    this._setProgress(this.adjustTime(time));
  }

  pause() {
    this._engine._remove(this);
    this.paused = true;
  }

  play() {
    if (!this.paused) {
      return;
    }
    this.paused = false;
    this.startTime = 0;
    this.lastTime = this.adjustTime(this.currentTime);

    this._engine._add(this);
  }

  reverse() {
    this.toggle();
    this.startTime = 0;
    this.lastTime = this.adjustTime(this.currentTime);
  }

  restart() {
    this.pause();
    this.reset();
    this.play();
  }

  reset() {
    const direction = this.direction;
    const loops = this.loop;
    this.currentTime = 0;
    this.progress = 0;
    this.paused = true;
    this.began = false;
    this.completed = false;
    this.reversed = direction === 'reverse';
    this.remaining = direction === 'alternate' && loops === 1 ? 2 : loops;
    this._setTracksProgress(0);
    for (let i = this.children.length - 1; i >= 0; --i) {
      this.children[i].reset();
    }
  }
}